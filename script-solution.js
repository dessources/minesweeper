/* ============================================================
   MINESWEEPER LOGIC — FINISHED WORKSHOP SOLUTION
   
   This file contains the complete, working solution structured in
   the same 15 progressive steps as the student starter file:
   Variables -> Types -> DOM -> Functions -> Objects -> Arrays
   -> Loops -> Higher-Order Functions -> Events -> Game Flow.
   ============================================================ */

/* ------------------------------------------------------------
   STEP 1: VARIABLES & CONSTANTS (SETTINGS)
   "const" defines values that never change while the game is running.
   ------------------------------------------------------------ */

const rows = 8; // how many rows of squares
const cols = 10; // how many columns of squares
const mines = 10; // how many mines are hidden in total

/* ------------------------------------------------------------
   STEP 2: DATA TYPES & GAME STATE
   "let" defines variables that WILL change as the player plays.
   Here we declare their names. They will hold booleans (true/false),
   numbers, and the 2D grid array.
   ------------------------------------------------------------ */

let grid; // 2D Array: grid[r][c] holds one cell's data
let firstClick; // Boolean: true until the player clicks their first cell
let gameOver; // Boolean: true when the player wins or loses
let flagsLeft; // Number: mines remaining to flag
let opened; // Number: count of safe squares revealed so far
let seconds; // Number: elapsed time in seconds
let timerId; // Number / ID: reference to the active setInterval timer

/* ------------------------------------------------------------
   STEP 3: GRAB ELEMENTS FROM THE HTML (THE DOM)
   document.getElementById('...') finds elements in index.html by id.
   We save them into variables so we can manipulate them later.
   ------------------------------------------------------------ */

const boardEl = document.getElementById("board"); // The grid wrapper
const flagsEl = document.getElementById("flags"); // Flag counter span
const timerEl = document.getElementById("timer"); // Timer display span
const newBtn = document.getElementById("new-btn"); // Restart ↻ button
const overlayEl = document.getElementById("overlay"); // Pop-up dialog box
const overlayIcons = document.getElementById("overlay-icons"); // Big pop-up symbol
const overlayText = document.getElementById("overlay-text"); // Pop-up message paragraph

/* ------------------------------------------------------------
   STEP 4: FUNCTIONS & BASIC UI UPDATES
   Functions bundle reusable code. Here we reset state variables,
   format numbers with string methods, and show/hide the pop-up.
   ------------------------------------------------------------ */

// Reset all game state variables back to their initial values
function resetGameState() {
  seconds = 0;
  opened = 0;
  flagsLeft = mines;
  firstClick = true;
  gameOver = false;
}

// Update the flag counter and timer displays on the page
function updateStats() {
  flagsEl.textContent = flagsLeft;
  // Format seconds as 3 digits (e.g. 7 -> "007") up to 999
  timerEl.textContent = String(Math.min(seconds, 999)).padStart(3, "0");
}

// Show the pop-up box with a specific symbol and message
function showOverlay(icon, text) {
  overlayIcons.textContent = icon;
  overlayText.textContent = text;
  overlayEl.classList.remove("hidden");
}

// Hide the pop-up box
function hideOverlay() {
  overlayEl.classList.add("hidden");
}

/* ------------------------------------------------------------
   STEP 5: OBJECTS (MODELING A SINGLE CELL)
   In JS, an object bundles multiple properties together in key-value
   pairs. Each square on our board is represented by this data structure.
   ------------------------------------------------------------ */

function createCell(r, c) {
  return {
    r: r, // row index
    c: c, // column index
    mine: false, // boolean: does it contain a mine?
    open: false, // boolean: has it been opened?
    flag: false, // boolean: is it flagged?
    count: 0, // number: how many neighboring mines touch it?
    el: null, // reference to its HTML <div> element
  };
}

/* ------------------------------------------------------------
   STEP 6: LOOPS & 2D ARRAYS (BUILDING THE GRID MATRIX)
   A 2D array is an array containing arrays (rows).
   grid[r][c] accesses the cell at row r, column c.
   ------------------------------------------------------------ */

function createEmptyGrid() {
  const matrix = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(createCell(r, c));
    }
    matrix.push(row);
  }
  return matrix;
}

/* ------------------------------------------------------------
   STEP 7: COORDINATE MATH & NESTED LOOPS (FINDING NEIGHBORS)
   Every cell has up to 8 neighbors. We loop delta rows (dr) and
   delta columns (dc) from -1 to 1, skipping (0, 0), and make sure
   the coordinates stay within the board boundaries.
   ------------------------------------------------------------ */

function neighbors(cell) {
  const list = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue; // Skip the cell itself

      const r = cell.r + dr;
      const c = cell.c + dc;

      // Check bounds: r and c must be within [0, rows) and [0, cols)
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        list.push(grid[r][c]);
      }
    }
  }
  return list;
}

/* ------------------------------------------------------------
   STEP 8: DOM CREATION & RENDERING (THE BOARD APPEARS!)
   document.createElement creates new HTML nodes in memory.
   appendChild puts them on the page. We also attach event listeners.
   ------------------------------------------------------------ */

// Create the <div> element for a single cell and wire up click handlers
function createCellElement(cell) {
  const el = document.createElement("div");
  el.className = "cell";

  // Left-click opens the cell
  el.addEventListener("click", () => openCell(cell.r, cell.c));

  // Right-click flags/unflags the cell (preventDefault stops context menu)
  el.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    toggleFlag(cell.r, cell.c);
  });

  return el;
}

// Clear the board on the webpage and populate it with cell elements
function renderBoard() {
  boardEl.innerHTML = "";
  boardEl.classList.remove("over");

  for (const row of grid) {
    for (const cell of row) {
      cell.el = createCellElement(cell);
      boardEl.appendChild(cell.el);
    }
  }
}

/* ------------------------------------------------------------
   STEP 9: HIGHER-ORDER FUNCTIONS: TIMERS
   setInterval takes a function and runs it periodically (every 1000 ms).
   clearInterval cancels it when the game is over.
   ------------------------------------------------------------ */

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    seconds++;
    updateStats();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
}

/* ------------------------------------------------------------
   STEP 10: WHILE LOOPS & RANDOMNESS (SAFE MINE PLACEMENT)
   Math.random() generates random floats. A while loop ensures we
   keep picking random positions until exactly `mines` mines are placed.
   We make sure the first-clicked cell (and its neighbors) stay safe!
   ------------------------------------------------------------ */

function placeMines(safeR, safeC) {
  let placed = 0;

  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    // Keep the starting cell and cells within 1 step of it safe
    const nearStart = Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1;

    if (!grid[r][c].mine && !nearStart) {
      grid[r][c].mine = true;
      placed++;
    }
  }

  // After placing mines, calculate the neighbor counts for all cells
  countAdjacentMines();
}

/* ------------------------------------------------------------
   STEP 11: HIGHER-ORDER FUNCTIONS: ARRAY METHODS (.filter)
   .filter() is a higher-order array method. We pass it an arrow
   function (n => n.mine) to quickly count surrounding mines.
   ------------------------------------------------------------ */

function countAdjacentMines() {
  for (const row of grid) {
    for (const cell of row) {
      cell.count = neighbors(cell).filter((n) => n.mine).length;
    }
  }
}

/* ------------------------------------------------------------
   STEP 12: CONDITIONALS & EVENT HANDLERS (FLAGGING & OPENING)
   Handling user input with guard clauses (early returns) and state updates.
   ------------------------------------------------------------ */

// Right-click handler: toggle flag
function toggleFlag(r, c) {
  if (gameOver) return;
  hideOverlay();

  const cell = grid[r][c];
  if (cell.open) return; // Opened squares cannot be flagged

  // Flip flag boolean
  cell.flag = !cell.flag;
  flagsLeft += cell.flag ? -1 : 1;

  // Update DOM
  cell.el.classList.toggle("flag", cell.flag);
  cell.el.textContent = cell.flag ? "⚑" : "";

  updateStats();
}

// Left-click handler: open a cell
function openCell(r, c) {
  if (gameOver) return;
  hideOverlay();

  const cell = grid[r][c];
  if (cell.open || cell.flag) return; // Ignore if open or flagged

  // First click triggers mine placement and starts timer
  if (firstClick) {
    placeMines(r, c);
    firstClick = false;
    startTimer();
  }

  // Hit a mine!
  if (cell.mine) {
    lose(cell);
    return;
  }

  // Safe square: reveal it
  reveal(cell);

  // Check if every non-mine cell has been opened
  if (opened === rows * cols - mines) {
    win();
  }
}

/* ------------------------------------------------------------
   STEP 13: RECURSION & HIGHER-ORDER FUNCTIONS (.forEach)
   When an empty cell (count === 0) is opened, it automatically
   reveals its neighbors. The function calls itself: this is RECURSION.
   .forEach(reveal) invokes reveal on every neighbor.
   ------------------------------------------------------------ */

function reveal(cell) {
  // Base cases: stop recursion if already open, flagged, or a mine
  if (cell.open || cell.flag || cell.mine) return;

  cell.open = true;
  opened++;

  // Visual connection to CSS
  cell.el.classList.add("open");

  // If neighboring mines exist, show the number and stop cascading
  if (cell.count > 0) {
    cell.el.classList.add("n" + cell.count);
    cell.el.textContent = cell.count;
    return;
  }

  // 0 neighboring mines: cascade and reveal all adjacent cells
  neighbors(cell).forEach(reveal);
}

/* ------------------------------------------------------------
   STEP 14: WIN & LOSS CONDITIONS (TEMPLATE LITERALS & GAME OVER)
   Handling game termination, styling end-state cells, and string interpolation.
   ------------------------------------------------------------ */

function endGame() {
  gameOver = true;
  stopTimer();
  boardEl.classList.add("over"); // CSS freezes clicks via pointer-events
}

function lose(hitCell) {
  endGame();

  // Highlight the clicked mine
  hitCell.el.classList.add("boom");

  // Reveal all mines on the board
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

function win() {
  endGame();
  showOverlay("★", `You win in ${seconds}s! Click to play again.`);
}

/* ------------------------------------------------------------
   STEP 15: PUTTING IT ALL TOGETHER (ORCHESTRATING NEW GAME)
   Connecting all components into the main game lifecycle and
   wiring up the top-level button listeners.
   ------------------------------------------------------------ */

function newGame() {
  stopTimer();
  resetGameState();
  grid = createEmptyGrid();
  renderBoard();
  updateStats();
  showOverlay("▶", "");
}

// Clicking the pop-up overlay dismisses it or restarts if game is over
overlayEl.addEventListener("click", () => {
  if (gameOver) newGame();
  hideOverlay();
});

// The ↻ button starts a new game
newBtn.addEventListener("click", newGame);

// Start the first game when the script loads!
newGame();
