/* ============================================================
   MINESWEEPER LOGIC — WORKSHOP STARTER VERSION
   
   Welcome to the JavaScript workshop!
   
   In index.html, we built the skeleton (the pieces).
   In styles.css, we dressed it up (the looks).
   Now in script.js, we give it a brain (the logic and reactions).
   
   We will build the game step-by-step from fundamental concepts:
     Variables -> Types -> DOM Elements -> Functions -> Objects
     -> Arrays -> Loops -> Higher-Order Functions -> Events -> Game Flow.
   
   Follow the steps below in order.
   ============================================================ */

/* ------------------------------------------------------------
   STEP 1: VARIABLES & CONSTANTS (SETTINGS)
   "const" defines a name for a value that NEVER changes while the
   game is running.
   
   Create 3 constants:
     - rows: set to 8 (how many rows on the board)
     - cols: set to 10 (how many columns on the board)
     - mines: set to 10 (how many hidden mines to place)
   ------------------------------------------------------------ */

// TODO: Define rows, cols, and mines using const
const rows = 8;
const cols = 10;
const mines = 10;

/* ------------------------------------------------------------
   STEP 2: DATA TYPES & GAME STATE VARIABLES
   "let" declares variables whose values CAN change over time as
   the player interacts with the game.
   
   These variables will store our game's state:
     - grid: will hold our 2D array of cells
     - firstClick: boolean (true until player makes their first move)
     - gameOver: boolean (true when player wins or loses)
     - flagsLeft: number (mines remaining to be flagged)
     - opened: number (safe squares opened so far)
     - seconds: number (elapsed time in seconds)
     - timerId: interval ID (so we can stop the timer when done)
   
   Declare them here with "let" so all functions below can see them.
   ------------------------------------------------------------ */

// TODO: Declare the game state variables using let
let grid;
let firstClick;
let gameOver;
let flagsLeft;
let opened;
let seconds;
let timerId;

/* ------------------------------------------------------------
   STEP 3: GRAB ELEMENTS FROM THE HTML (THE DOM)
   The Document Object Model (DOM) is the bridge between HTML and JS.
   document.getElementById("name") finds the HTML element with id="name".
   
   We store each element in a variable ending in "El" or "Btn" so we
   can change its text or classes later:
     - boardEl: element with id "board"
     - flagsEl: element with id "flags"
     - timerEl: element with id "timer"
     - newBtn: element with id "new-btn"
     - overlayEl: element with id "overlay"
     - overlayIcons: element with id "overlay-icons"
     - overlayText: element with id "overlay-text"
   ------------------------------------------------------------ */

const boardEl = document.getElementById("board");
const flagsEl = document.getElementById("flags");
const timerEl = document.getElementById("timer");
const newBtn = document.getElementById("new-btn");
const overlayEl = document.getElementById("overlay");
const overlayIcons = document.getElementById("overlay-icons");
const overlayText = document.getElementById("overlay-text");

/* ------------------------------------------------------------
   STEP 4: FUNCTIONS & BASIC UI UPDATES
   A function is a reusable box of code that performs an action.
   
   1. resetGameState():
      Give your state variables from Step 2 their starting values:
      - seconds = 0
      - opened = 0
      - flagsLeft = mines
      - firstClick = true
      - gameOver = false
   
   2. updateStats():
      Update flagsEl.textContent with flagsLeft.
      Update timerEl.textContent with seconds (formatted as 3 digits
      like "007" using String(Math.min(seconds, 999)).padStart(3, "0")).
   
   3. showOverlay(icon, text) and hideOverlay():
      showOverlay sets overlayIcons.textContent to icon,
      overlayText.textContent to text, and removes the "hidden" class.
      hideOverlay adds the "hidden" class.
   ------------------------------------------------------------ */

function resetGameState() {
  // TODO: Reset seconds, opened, flagsLeft, firstClick, and gameOver
}

function updateStats() {
  // TODO: Update flagsEl and timerEl text content
}

function showOverlay(icon, text) {
  // TODO: Set overlay icon and text, then remove "hidden" from overlayEl.classList
}

function hideOverlay() {
  // TODO: Add "hidden" to overlayEl.classList
}

/* ------------------------------------------------------------
   STEP 5: OBJECTS (MODELING A SINGLE CELL)
   An object bundles related properties together using { key: value }.
   
   Write createCell(r, c) so it returns an object representing one square:
     - r: row index
     - c: column index
     - mine: boolean (false)
     - open: boolean (false)
     - flag: boolean (false)
     - count: number (0)
     - el: null (will hold its HTML <div> element in Step 8)
   ------------------------------------------------------------ */

function createCell(r, c) {
  // TODO: Return a cell object with r, c, mine, open, flag, count, and el
  return {};
}

/* ------------------------------------------------------------
   STEP 6: LOOPS & 2D ARRAYS (BUILDING THE GRID MATRIX)
   A 2D array is an array of arrays (a grid).
   grid[r][c] gives you the cell at row r, column c.
   
   Write createEmptyGrid():
     1. Create an empty array named matrix.
     2. Use an outer "for" loop running r from 0 to rows - 1.
     3. Inside it, create an empty row array.
     4. Use an inner "for" loop running c from 0 to cols - 1.
     5. Push createCell(r, c) into row.
     6. Push row into matrix.
     7. Return matrix.
   ------------------------------------------------------------ */

function createEmptyGrid() {
  const matrix = [];
  // TODO: Write the nested loops to fill and return matrix
  return matrix;
}

/* ------------------------------------------------------------
   STEP 7: COORDINATE MATH & NESTED LOOPS (FINDING NEIGHBORS)
   Every square on the board has up to 8 neighbors touching it.
   "dr" and "dc" stand for "delta row" and "delta column".
   Looping dr from -1 to 1 and dc from -1 to 1 covers all 8 directions.
   
   Write neighbors(cell):
     1. Create an empty array named list.
     2. Loop dr from -1 to 1 and dc from -1 to 1.
     3. Skip (0, 0) because that's the square itself!
     4. Calculate r = cell.r + dr and c = cell.c + dc.
     5. Make sure (r, c) is inside the board: r >= 0 && r < rows && c >= 0 && c < cols.
     6. If valid, push grid[r][c] into list.
     7. Return list.
   ------------------------------------------------------------ */

function neighbors(cell) {
  const list = [];
  // TODO: Nested loops for dr and dc from -1 to 1, check bounds, push to list
  return list;
}

/* ------------------------------------------------------------
   STEP 8: DOM CREATION & RENDERING (THE BOARD APPEARS!)
   document.createElement("div") creates a new HTML tag in memory.
   boardEl.appendChild(el) puts it on the page.
   
   1. createCellElement(cell):
      - Create a "div" element and give it className = "cell".
      - Add a "click" event listener calling openCell(cell.r, cell.c).
      - Add a "contextmenu" event listener that calls e.preventDefault()
        (to stop the browser menu) and toggleFlag(cell.r, cell.c).
      - Return the created element.
   
   2. renderBoard():
      - Clear existing cells: boardEl.innerHTML = "".
      - Remove "over" from boardEl.classList.
      - Loop through grid with "for (const row of grid)":
          Loop through row with "for (const cell of row)":
            Set cell.el = createCellElement(cell).
            Append cell.el to boardEl.
   ------------------------------------------------------------ */

function createCellElement(cell) {
  const el = document.createElement("div");
  // TODO: Set class, attach click and contextmenu listeners, and return el
  return el;
}

function renderBoard() {
  // TODO: Clear boardEl, iterate over grid, create elements, and append to boardEl
}

/* ------------------------------------------------------------
   STEP 9: HIGHER-ORDER FUNCTIONS: TIMERS (setInterval)
   A higher-order function is a function that takes another function
   as an argument.
   
   setInterval(fn, 1000) runs fn every 1000 milliseconds (1 second).
   clearInterval(timerId) stops it.
   
   1. startTimer():
      - Call clearInterval(timerId) first to clear any old timer.
      - Set timerId = setInterval(() => { seconds++; updateStats(); }, 1000).
   
   2. stopTimer():
      - Call clearInterval(timerId).
   ------------------------------------------------------------ */

function startTimer() {
  // TODO: Start the 1-second interval to increment seconds and update stats
}

function stopTimer() {
  // TODO: Clear the timer interval
}

/* ------------------------------------------------------------
   STEP 10: WHILE LOOPS & RANDOMNESS (SAFE MINE PLACEMENT)
   Math.random() gives a random decimal from 0 to 0.999...
   Math.floor(...) rounds it down to an integer.
   
   A "while" loop keeps running until placed reaches mines:
     1. Pick a random r (between 0 and rows - 1) and random c.
     2. Ensure the first-clicked cell is SAFE:
        nearStart is true if Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1.
     3. If !grid[r][c].mine && !nearStart:
        Set grid[r][c].mine = true and increment placed.
     4. After the while loop finishes, call countAdjacentMines() (from Step 11).
   ------------------------------------------------------------ */

function placeMines(safeR, safeC) {
  let placed = 0;
  // TODO: While loop placing random mines safely, then count adjacent mines
}

/* ------------------------------------------------------------
   STEP 11: HIGHER-ORDER FUNCTIONS: ARRAY METHODS (.filter)
   .filter() runs a test function on each item in an array and keeps
   only the items where the test returns true.
   
   Write countAdjacentMines():
     Loop through all cells in the grid.
     For each cell, set:
       cell.count = neighbors(cell).filter(n => n.mine).length;
   ------------------------------------------------------------ */

function countAdjacentMines() {
  // TODO: Loop through grid and use .filter() on neighbors to calculate cell.count
}

/* ------------------------------------------------------------
   STEP 12: CONDITIONALS & EVENT HANDLERS (FLAGGING & OPENING)
   Event handlers react to player actions. Guard clauses (if (...) return)
   exit early if a click should be ignored.
   
   1. toggleFlag(r, c):
      - If gameOver, return.
      - Call hideOverlay().
      - If cell.open, return (can't flag an open cell).
      - Flip the flag: cell.flag = !cell.flag.
      - Adjust flagsLeft: flagsLeft += cell.flag ? -1 : 1.
      - Toggle the "flag" class on cell.el using classList.toggle.
      - Set cell.el.textContent to "⚑" if flagged, or "" if unflagged.
      - Call updateStats().
   
   2. openCell(r, c):
      - If gameOver, return.
      - Call hideOverlay().
      - If cell.open or cell.flag, return.
      - If firstClick is true:
          call placeMines(r, c), set firstClick = false, and call startTimer().
      - If cell.mine is true:
          call lose(cell) and return!
      - Call reveal(cell).
      - If opened === rows * cols - mines:
          call win()!
   ------------------------------------------------------------ */

function toggleFlag(r, c) {
  // TODO: Toggle flag state, update flagsLeft, update cell element, updateStats
}

function openCell(r, c) {
  // TODO: Guard clauses, first-click initialization, mine check, reveal, win check
}

/* ------------------------------------------------------------
   STEP 13: RECURSION & HIGHER-ORDER FUNCTIONS (.forEach)
   Recursion is when a function calls ITSELF.
   When an empty square (count === 0) is opened, it automatically
   opens all surrounding neighbors, which open their neighbors, etc.
   
   Write reveal(cell):
     1. Base case: if cell.open || cell.flag || cell.mine, return!
     2. Set cell.open = true and increment opened.
     3. Add "open" to cell.el.classList.
     4. If cell.count > 0:
        Add "n" + cell.count to cell.el.classList (e.g. "n2"),
        set cell.el.textContent = cell.count,
        and RETURN (stop spreading).
     5. If cell.count === 0:
        Call neighbors(cell).forEach(reveal) to cascade!
   ------------------------------------------------------------ */

function reveal(cell) {
  // TODO: Base case, mark open, add classes, show count or forEach(reveal)
}

/* ------------------------------------------------------------
   STEP 14: WIN & LOSS CONDITIONS (GAME OVER & TEMPLATES)
   Template literals `like ${this}` allow putting variables inside strings.
   
   1. endGame():
      - Set gameOver = true.
      - Call stopTimer().
      - Add "over" to boardEl.classList (CSS freezes clicks).
   
   2. lose(hitCell):
      - Call endGame().
      - Add "boom" to hitCell.el.classList.
      - Loop through all cells in grid: if cell.mine is true,
        add "mine" to cell.el.classList and set cell.el.textContent = "✸".
      - Call showOverlay("✕", "Game over. Click to play again.").
   
   3. win():
      - Call endGame().
      - Call showOverlay("★", `You win in ${seconds}s! Click to play again.`).
   ------------------------------------------------------------ */

function endGame() {
  // TODO: Set gameOver, stop timer, freeze board
}

function lose(hitCell) {
  // TODO: Call endGame, highlight boom cell, reveal all mines, show loss overlay
}

function win() {
  // TODO: Call endGame, show victory overlay with seconds elapsed
}

/* ------------------------------------------------------------
   STEP 15: PUTTING IT ALL TOGETHER (ORCHESTRATING NEW GAME)
   Now we assemble all our functions into the game lifecycle.
   
   1. newGame():
      - stopTimer()
      - resetGameState()
      - grid = createEmptyGrid()
      - renderBoard()
      - updateStats()
      - showOverlay("▶", "")
   
   2. Wire up listeners:
      - overlayEl: on "click", if gameOver then newGame(), then hideOverlay().
      - newBtn: on "click", call newGame.
   
   3. Call newGame() at the very bottom so the game starts when page loads!
   ------------------------------------------------------------ */

function newGame() {
  stopTimer();
  resetGameState();
  grid = createEmptyGrid();
  renderBoard();
  updateStats();
  showOverlay("▶", "");
}

// TODO: Attach event listeners to overlayEl and newBtn, then invoke newGame()
overlayEl.addEventListener("click", () => {
  if (gameOver) newGame();
  hideOverlay();
});

newBtn.addEventListener("click", newGame);

newGame();
