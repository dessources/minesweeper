/* ============================================================
   MINESWEEPER LOGIC 

   You do NOT need to edit this file today. This is the "brain"
   of the game. Read the comments if you're curious how it works.

   THE BIG IDEA FOR CSS:
   JS never sets colors or sizes. It only adds or removes CLASS
   NAMES on the squares, and your CSS decides what each class
   looks like. These are the classes JS adds to each cell:

   cell      every square
   open      a square that has been opened
   n1 - n8   the number inside an opened square
   flag      a square with a flag
   mine      a mine (shown when you lose)
   boom      the mine you clicked

   It also adds these to other elements:
   over      on the board when the game ends (we freeze clicks)
   hidden    on the pop-up box when it should disappear
   ============================================================ */

/* ------------------------------------------------------------
   SETTINGS
   const = a value that never changes while the game runs.
   Change these numbers to make a bigger board or more mines.
   (If you change cols, also change repeat(10, 40px) in the CSS.)
   ------------------------------------------------------------ */

const rows = 8; // how many rows of squares
const cols = 10; // how many columns of squares
const mines = 10; // how many mines are hidden

/* ------------------------------------------------------------
      GRAB ELEMENTS FROM THE HTML
      document.getElementById('board') finds the element in
      index.html that has id="board". We save each one in a variable
      so we can change it later. The "El" at the end of a name just
      means "element".
      ------------------------------------------------------------ */

const boardEl = document.getElementById("board"); // the grid that holds the squares
const flagsEl = document.getElementById("flags"); // the flag counter number
const timerEl = document.getElementById("timer"); // the timer number
const newBtn = document.getElementById("new-btn"); // the ↻ button
const overlayEl = document.getElementById("overlay"); // the whole pop-up box
const overlayIcons = document.getElementById("overlay-icons"); // the big symbol in the pop-up
const overlayText = document.getElementById("overlay-text"); // the message in the pop-up

/* ------------------------------------------------------------
      GAME STATE
      let = a value that CAN change as the game goes on.
      These are declared here (without values yet) so every function
      below can use them. newGame() gives them their starting values.
      ------------------------------------------------------------ */

let grid; // the 2D array: grid[row][col] gives one square's data
let firstClick, gameOver; // true/false switches
let flagsLeft; // mines minus flags placed (what the counter shows)
let opened; // how many safe squares have been opened so far
let seconds; // timer value
let timerId; // remembers the running timer so we can stop it

/* ============================================================
      START A GAME
      Runs once when the page loads, and again every time you press
      ↻ or play again.
      ============================================================ */

function newGame() {
  // Stop any timer left over from the last game, then reset everything
  clearInterval(timerId);
  seconds = 0;
  opened = 0;
  flagsLeft = mines;
  firstClick = true; // mines aren't placed until the first click
  gameOver = false;

  // Empty the board and un-freeze it
  boardEl.innerHTML = "";
  boardEl.classList.remove("over");

  /* Build the 2D array.
        A 2D array is a list of rows, and each row is a list of squares.
        grid[2][5] means "row 2, column 5".
        At the same time, we create one <div class="cell"> for each
        square and put it on the page. */
  grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      // Make the HTML square and give it the class "cell"
      const el = document.createElement("div");
      el.className = "cell";

      // Left click opens the square
      el.addEventListener("click", () => openCell(r, c));

      // Right click puts a flag on it.
      // preventDefault() stops the browser's normal right-click menu.
      el.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        toggleFlag(r, c);
      });

      // Put the square on the page (the CSS grid arranges them)
      boardEl.appendChild(el);

      // Store the square's data in our array.
      // el = its HTML element, mine = has a mine?, open = opened?,
      // flag = flagged?, count = how many mines touch it
      row.push({ r, c, el, mine: false, open: false, flag: false, count: 0 });
    }
    grid.push(row);
  }

  updateStats();
  showOverlay("▶", ""); // show the "click to start" pop-up
}

/* ============================================================
      MINES
      ============================================================ */

/* Place the mines randomly.
      This runs on your FIRST click, not at the start, so the first
      click can never hit a mine. safeR and safeC are the row and
      column you clicked. */
function placeMines(safeR, safeC) {
  let placed = 0;

  while (placed < mines) {
    // Pick a random row and column
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    // Is this square within 1 step of where you clicked?
    const nearStart = Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1;

    // Only place a mine if there isn't one already and it's not near the click
    if (!grid[r][c].mine && !nearStart) {
      grid[r][c].mine = true;
      placed++;
    }
  }

  // Now count how many mines touch each square. That's the number
  // you see (1-8). neighbors(cell) gives the squares around it,
  // .filter keeps only the ones with mines, and .length counts them.
  for (const row of grid) {
    for (const cell of row) {
      cell.count = neighbors(cell).filter((n) => n.mine).length;
    }
  }
}

/* Return a list of the squares touching this one (up to 8).
      dr and dc mean "change in row" and "change in column".
      Looping from -1 to 1 for both visits every square around it. */
function neighbors(cell) {
  const list = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      // (0, 0) is the square itself, so skip it
      if (dr === 0 && dc === 0) continue;

      const r = cell.r + dr;
      const c = cell.c + dc;

      // Only add it if it's actually on the board (not off the edge)
      if (r >= 0 && r < rows && c >= 0 && c < cols) list.push(grid[r][c]);
    }
  }
  return list;
}

/* ============================================================
      CLICKING
      ============================================================ */

/* Runs when you left-click a square */
function openCell(r, c) {
  if (gameOver) return; // ignore clicks after the game ends
  hideOverlay(); // the first click also dismisses the start pop-up

  const cell = grid[r][c];

  // Ignore squares that are already open or have a flag on them
  if (cell.open || cell.flag) return;

  // The very first click: place the mines and start the timer
  if (firstClick) {
    placeMines(r, c);
    firstClick = false;
    // setInterval runs the code every 1000 ms (once a second)
    timerId = setInterval(() => {
      seconds++;
      updateStats();
    }, 1000);
  }

  // Clicked a mine: you lose
  if (cell.mine) return lose(cell);

  // Otherwise it's safe, so open it
  reveal(cell);

  // If every safe square is open, you win
  if (opened === rows * cols - mines) win();
}

/* Opens one square.
      If it has 0 mines nearby, it also opens all its neighbors,
      which open THEIR neighbors, and so on. The function calls itself
      (this is called recursion), which makes empty areas "spread". */
function reveal(cell) {
  // Stop if it's already open, flagged, or a mine
  if (cell.open || cell.flag || cell.mine) return;

  cell.open = true;
  opened++;

  // THIS is where JS and CSS connect: add the class "open",
  // and the CSS rule .cell.open changes how the square looks
  cell.el.classList.add("open");

  // If mines are nearby, show the number and STOP spreading.
  // 'n' + 3 makes the class name "n3", which the CSS colors.
  if (cell.count > 0) {
    cell.el.classList.add("n" + cell.count);
    cell.el.textContent = cell.count;
    return;
  }

  // 0 mines nearby: open every neighbor too
  neighbors(cell).forEach(reveal);
}

/* Runs when you right-click a square: adds or removes a flag */
function toggleFlag(r, c) {
  if (gameOver) return;
  hideOverlay();

  const cell = grid[r][c];
  if (cell.open) return; // can't flag an opened square

  // Flip the flag on or off (true becomes false, false becomes true)
  cell.flag = !cell.flag;

  // Placing a flag means one fewer left. Removing one adds it back.
  flagsLeft += cell.flag ? -1 : 1;

  // classList.toggle(name, true) adds the class, (name, false) removes it
  cell.el.classList.toggle("flag", cell.flag);

  // Show the flag symbol, or clear it
  cell.el.textContent = cell.flag ? "⚑" : "";

  updateStats();
}

/* ============================================================
      ENDING THE GAME
      ============================================================ */

/* You clicked a mine. hitCell is the one you clicked. */
function lose(hitCell) {
  endGame();

  // The mine you clicked gets "boom" (the CSS makes it bright red)
  hitCell.el.classList.add("boom");

  // Show every mine on the board
  for (const row of grid) {
    for (const cell of row) {
      if (cell.mine) {
        cell.el.classList.add("mine");
        cell.el.textContent = "✸";
      }
    }
  }

  showOverlay("✕", "Game over. Click to play again.");
}

/* You opened every safe square */
function win() {
  endGame();
  // Backticks `like this` let us put a variable inside text with ${ }
  showOverlay("★", `You win in ${seconds}s! Click to play again.`);
}

/* Things that happen whether you win or lose */
function endGame() {
  gameOver = true;
  clearInterval(timerId); // stop the timer
  boardEl.classList.add("over"); // the CSS rule .board.over .cell freezes clicks
}

/* ============================================================
      LITTLE HELPERS
      Small functions used in several places above.
      ============================================================ */

/* Update the flag counter and the timer on the page */
function updateStats() {
  flagsEl.textContent = flagsLeft;

  // Show the timer as 3 digits (7 becomes "007") and stop at 999.
  // padStart(3, '0') adds zeros on the left until it's 3 characters long.
  timerEl.textContent = String(Math.min(seconds, 999)).padStart(3, "0");
}

/* Show the pop-up box with a symbol and a message */
function showOverlay(icons, text) {
  overlayIcons.textContent = icons;
  overlayText.textContent = text;
  overlayEl.classList.remove("hidden"); // removing "hidden" makes it show
}

/* Hide the pop-up box. The CSS rule .overlay.hidden { display: none }
      is what actually makes it disappear. */
function hideOverlay() {
  overlayEl.classList.add("hidden");
}

/* ============================================================
      BUTTONS
      ============================================================ */

/* Clicking the pop-up: if the game is over, start a new one.
      Either way, hide the pop-up. */
overlayEl.addEventListener("click", () => {
  if (gameOver) newGame();
  hideOverlay();
});

/* The ↻ button starts a new game */
newBtn.addEventListener("click", newGame);

/* ============================================================
      START
      This last line runs when the page loads and starts the first game.
      ============================================================ */

newGame();
