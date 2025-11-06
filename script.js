const words = [
    'monyi',
    'nyulca',
    'csumpa',
    'dragic',
    'gecifej',
    'nigga',
    'nyunyi',
    'cukii',
    'cukso',
    'murnyo',
    'fenci',
    'sunyi',
    'puszko',
    'kismuki',
    'tutko'
]
const WORDS = words.map(word => word.toUpperCase());
const WORD24 = 'SZERETLEK'
const CHRISTMAS_RED = '#ea1c24';
const CHRISTMAS_GREEN = '#008d6b';

const DEBUG = true // TODO: set to false

function getNextChristmas(currentDate) {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const christmasMonth = 11;
  const christmasDay = 24;

  let nextChristmasYear;

  if (currentMonth < christmasMonth || (currentMonth === christmasMonth && currentDay <= christmasDay)) {
    nextChristmasYear = currentYear;
  } else {
    nextChristmasYear = currentYear + 1;
  }
  return new Date(nextChristmasYear, 11, 24);
}

function getLocalStorageData(key) {
    let rawGamesData = localStorage.getItem(key);
    return JSON.parse(rawGamesData);
}

function setLocalStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function setUpLocalStorage(debugging=false){
    if (!debugging){
            // stores the win (true) or lose (false) for every day in a dicionary
        // the keys are the days
        if (!localStorage.winnings){
            localStorage.setItem('winnings', JSON.stringify([]));
        }

        // store the state of the game true (it's in progress) or false (it's over) in  dictionary
        // the keys are the days
        if (!localStorage.isGamesOver){
            localStorage.setItem('isGamesOver', JSON.stringify({}));
        }

        // stores the number of tryes for every day in a list
        // the indexes are the days
        if (!localStorage.tryCount){
            localStorage.setItem('tryCount', JSON.stringify([]));
        }
    } else{
        localStorage.setItem('winnings', JSON.stringify([]));
        localStorage.setItem('isGamesOver', JSON.stringify({}));
        localStorage.setItem('tryCount', JSON.stringify([]));
    }




}


document.addEventListener('DOMContentLoaded', () => {
    const todayDate = new Date();
    const today = todayDate.getDate();
    const gridElement = document.getElementById('game-grid');

    // rules container
    const rulesButton = document.getElementById('rules-button');
    const closeButton = document.getElementById('close-button');
    const rulesContainer = document.getElementById('rules-aside');

    rulesButton.addEventListener('click', () => {
        rulesContainer.classList.add('visible');
        closeButton.classList.add('visible');
    
    });

    closeButton.addEventListener('click', () => {
        rulesContainer.classList.remove('visible');
        closeButton.classList.remove('visible');
    });

    if (!DEBUG && todayDate.getMonth() !== 11){
        // todo: delete localStorage
        setIdleScreen('Látogass vissza decemberben :))');
        return
    }

    if (!DEBUG && today > 24){
        setIdleScreen('Az Adventi időszak elmúlt. Élvezd a szünetet, amíg tudod.');
        return
    }

    setUpLocalStorage(false); // TODO: delete the parameter 

    // word selection
    let selectedWord = today == 24 ? WORD24 : WORDS[today - 1];
    console.log(selectedWord) // TODO: delete

    let wordLength = selectedWord.length
    let currentCol = 0
    let currentRow = 0

    const messageElement = document.getElementById('feedback-message');
    const keyboardContainer = document.getElementById('keyboard-container');
    let allRows = [];

    // countdown to christmas
    const nextChristmas = getNextChristmas(todayDate);
    const diff = nextChristmas.getTime() - todayDate.getTime();
    const diffInDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

    const countdownHeader = document.getElementById('countdown-header');
    countdownHeader.textContent = diffInDays + ' nap van hátra Karácsonyig!';

    // calendar function
    let gamesData = getLocalStorageData('isGamesOver')
    
    let isGameOver = false;
    if (gamesData[today] === true){
        isGameOver = true;
    } else if (gamesData[today] !== false) {
        isGameOver = false;
        gamesData[today] = false;
        setLocalStorageData('isGamesOver', gamesData);
    }

    let winningsData = getLocalStorageData('winnings')

    if (!winningsData[today - 1]) {
        winningsData[today - 1] = 0;
        setLocalStorageData('winnings', winningsData);
    }
    let countData = getLocalStorageData('tryCount')


    console.log(winningsData[today - 1]) // TODO: delete
    console.log(gamesData[today]) // TODO: delete
    console.log(countData) // TODO: delete

    // stats DOM elements
    const wonGamesSpan = document.getElementById('won-games-span');
    const sumGamesSpan = document.getElementById('sum-games-span');
    const todaySpan = document.getElementById('today-span');
    const avgScoreSpan = document.getElementById('avg-score-span');

    function updateStats(){
        // TODO: not finished
        wonGamesSpan.textContent = winningsData.reduce((partialSum, a) => partialSum + a, 0)
        sumGamesSpan.textContent = winningsData.length
        avgScoreSpan.textContent = Math.ceil(countData.reduce((partialSum, a) => partialSum + a, 0) / countData.length)

        if (isGameOver){
            if (winningsData[today - 1]){
                todaySpan.textContent = `Megnyert játék ${countData[today - 1]} próbálkozással`
            }
            else{
                todaySpan.textContent = 'Elvesztett játék'
            }
            
        } else{
            todaySpan.textContent = '-'
        }
    }

    function initGame() {
        // Reset game state
        currentRow = 0;
        currentCol = 0;
        isGameOver = false;
        messageElement.textContent = "";
        countData[today - 1] = 0;
        setLocalStorageData('tryCount', countData);

        // Clear and create the grid
        createGrid();
    }

    function createGrid() {
        gridElement.innerHTML = ""; // Clear existing grid
        allRows = []; // Reset the rows array

        for (let r = 0; r < wordLength; r++) {
            const row = document.createElement('div');
            row.className = 'grid-row';
            
            let rowTiles = []; // Store tiles for this specific row
            for (let c = 0; c < wordLength; c++) {
                const tile = document.createElement('div');
                tile.className = 'grid-tile';
                row.appendChild(tile);
                rowTiles.push(tile);
            }
            gridElement.appendChild(row);
            allRows.push(rowTiles);
        }
    }

    /**
     * Handles all key presses from the user.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    function handleKeyPress(e) {
        if (isGameOver) return; // S input if game is over

        const key = e.key;

        if (key.match(/^[a-zA-Z]$/) && currentCol < wordLength) {
            // A letter was pressed
            addLetter(key.toUpperCase());
        } else if (key === 'Backspace' && currentCol > 0) {
            // Backspace was pressed
            removeLetter();
        } else if (key === 'Enter' && currentCol === wordLength) {
            // Enter was pressed
            submitGuess();
        }
    }

    /**
     * --- Handles all clicks on the *on-screen* keyboard.
     * @param {MouseEvent} e - The mouse event.
     */
    function handleMouseClick(e) {
        if (isGameOver) return;

        // Find the button that was clicked using event delegation
        const target = e.target;
        if (!target.matches('button[data-key]')) {
            return; // Clicked on the container, not a button
        }

        const key = target.dataset.key; // Get key from "data-key" attribute

        if (key === 'ENTER') {
            if (currentCol === wordLength) {
                submitGuess();
            }
        } else if (key === 'BACKSPACE') {
            if (currentCol > 0) {
                removeLetter();
            }
        } else {
            // It's a letter key
            if (currentCol < wordLength) {
                addLetter(key); // 'key' is already uppercase
            }
        }
    }

    /**
     * Adds a letter to the current tile.
     * @param {string} letter - The letter to add.
     */
    function addLetter(letter) {
        const tile = allRows[currentRow][currentCol];
        tile.textContent = letter;
        currentCol++;
    }

    /**
     * Removes the last letter from the current row.
     */
    function removeLetter() {
        currentCol--;
        const tile = allRows[currentRow][currentCol];
        tile.textContent = "";
    }
    /**
     * Sets and saves the game values in localStorage based on the won parameter.
     * @param {boolean} won - If the game was won or not.
     */
    function setGameValues(won){
        isGameOver = true
        gamesData[today] = true;
        setLocalStorageData('isGamesOver', gamesData);

        if (won){
            winningsData[today - 1] = 1;
        }
        else{
            winningsData[today - 1] = 0;
            countData[today - 1] = 0;
            setLocalStorageData('tryCount', countData);
        }
        
        setLocalStorageData('winnings', winningsData);

        updateStats();
    }

    /**
     * Submits the current guess for evaluation.
     */
    function submitGuess() {
        countData[today - 1] += 1;
        setLocalStorageData('tryCount', countData);

        const guess = allRows[currentRow].map(tile => tile.textContent).join('');

        // --- SIMPLIFICATION ---
        // A real Wordle checks if the guess is a valid word in a dictionary.
        // We are skipping that for this basic template.

        // Start the evaluation
        evaluateGuess(guess);

        // Check for win
        if (guess === selectedWord) {
            messageElement.textContent = "Juhúú nyertél! 🎉";
            messageElement.style.color = CHRISTMAS_GREEN;
            messageElement.style.backgroundColor = 'white';
            setGameValues(true);
            return;
        }

        // Move to the next row
        currentRow++;
        currentCol = 0;

        // Check for loss
        if (currentRow === wordLength) {
            messageElement.textContent = `Sajos nem jött össze! A szó ${selectedWord} volt.`;
            messageElement.style.color = CHRISTMAS_RED;
            messageElement.style.backgroundColor = 'white';
            setGameValues(false);
        }
    }

    /**
     * Evaluates the guess and applies colors to the tiles.
     * This uses a two-pass system to correctly handle duplicate letters.
     * @param {string} guess - The 5-letter guessed word.
     */
    function evaluateGuess(guess) {
        const targetArray = selectedWord.split('');
        const guessArray = guess.split('');
        const tiles = allRows[currentRow];
        const letterCounts = {}; // To track target word letter counts

        // Build a count of letters in the target word
        for (const letter of targetArray) {
            letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        }

        // --- Pass 1: Check for 'correct' (green) matches ---
        for (let i = 0; i < wordLength; i++) {
            if (guessArray[i] === targetArray[i]) {
                tiles[i].classList.add('correct');
                letterCounts[guessArray[i]]--; // Decrement count for this 'used' letter
            }
        }

        // --- Pass 2: Check for 'present' (yellow) and 'absent' (gray) ---
        for (let i = 0; i < wordLength; i++) {
            // Skip if already marked as 'correct'
            if (tiles[i].classList.contains('correct')) continue;

            if (targetArray.includes(guessArray[i]) && letterCounts[guessArray[i]] > 0) {
                // Letter is present in the word and not all instances are 'correct'
                tiles[i].classList.add('present');
                letterCounts[guessArray[i]]--; // Decrement count
            } else {
                // Letter is not in the word or all instances are already marked
                tiles[i].classList.add('absent');
            }
        }

        updateKeyboard(guessArray, tiles);
    }

    /**
     * --- NEW: Updates the on-screen keyboard key colors based on the guess.
     * @param {string[]} guessArray - The 5-letter guessed word as an array.
     * @param {HTMLElement[]} tiles - The array of 5 tile elements for the current row.
     */
    function updateKeyboard(guessArray, tiles) {
        for (let i = 0; i < guessArray.length; i++) {
            const letter = guessArray[i];
            const tile = tiles[i];
            const keyButton = document.querySelector(`#keyboard-container button[data-key="${letter}"]`);
            
            if (!keyButton) continue;

            // Check the state of the tile and apply it to the key
            // This logic prevents a 'correct' key from ever being downgraded
            
            if (tile.classList.contains('correct')) {
                // Always upgrade to correct
                keyButton.classList.remove('present', 'absent');
                keyButton.classList.add('correct');
            } else if (tile.classList.contains('present')) {
                // Only upgrade if not already correct
                if (!keyButton.classList.contains('correct')) {
                    keyButton.classList.add('present');
                }
            } else if (tile.classList.contains('absent')) {
                // Only set to absent if not already correct or present
                if (!keyButton.classList.contains('correct') && !keyButton.classList.contains('present')) {
                    keyButton.classList.add('absent');
                }
            }
        }
    }

    updateStats();

    function setIdleScreen(message){
        gridElement.classList.add('idle');
        gridElement.innerText = message;
    }

    document.addEventListener('keydown', handleKeyPress);

    keyboardContainer.addEventListener('click', handleMouseClick);
    
    if (!isGameOver){
        initGame();
    } else{
        let message = 'A mai nap már játszottál! A következő feladványért látogass vissza holnap!';
        setIdleScreen(message);
    }

    
});