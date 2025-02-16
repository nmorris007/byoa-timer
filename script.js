let timeLeft;
let timerId = null;
let isWorkMode = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const toggleButton = document.getElementById('toggle');
const focusSound = document.getElementById('focusSound');
const startSound = document.getElementById('startSound');
const endSound = document.getElementById('endSound');
const focusInput = document.getElementById('focusInput');
const breakInput = document.getElementById('breakInput');
const breakSound = document.getElementById('breakSound');

const WORK_TIME = 25 * 60;  // 25 minutes in seconds
const REST_TIME = 5 * 60;   // 5 minutes in seconds

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update the timer display
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Emoji indicator followed by time
    const indicator = isWorkMode ? '🧠' : '☕';  // Brain for focus, Coffee for rest
    document.title = `${indicator} ${timeString}`;
}

function startTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        startButton.textContent = isWorkMode ? 'Begin Focus' : 'Begin Rest';
        startButton.classList.remove('pause-state');
        timerId = null;
        return;
    }
    
    if (isWorkMode) {
        startSound.play();
    }
    
    startButton.textContent = 'Pause';
    startButton.classList.add('pause-state');
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            endSound.play();
            // Automatically switch modes and start the timer
            toggleMode();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkMode ? getWorkTime() : getRestTime();
    updateDisplay();
    startButton.textContent = isWorkMode ? 'Begin Focus' : 'Begin Rest';
    startButton.classList.remove('pause-state');  // Remove red when reset
}

function toggleMode() {
    const timerDisplay = document.querySelector('.timer');
    
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
    
    if (isWorkMode) {  // Switching to rest mode
        timeLeft = getRestTime();
        toggleButton.textContent = 'Return to Focus';
        startButton.textContent = 'Pause';
        startButton.classList.add('pause-state');
        toggleButton.classList.add('rest-mode');
        timerDisplay.classList.remove('work-mode');
        timerDisplay.classList.add('rest-mode');
        isWorkMode = false;
        breakSound.volume = 0.7;
        breakSound.play();
    } else {  // Switching to focus mode
        timeLeft = getWorkTime();
        toggleButton.textContent = 'Take a Break';
        startButton.textContent = 'Pause';
        startButton.classList.add('pause-state');
        toggleButton.classList.remove('rest-mode');
        timerDisplay.classList.remove('rest-mode');
        timerDisplay.classList.add('work-mode');
        isWorkMode = true;
        startSound.play();
    }
    
    updateDisplay();
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            endSound.play();
            // Automatically switch modes and start the timer
            toggleMode();
        }
    }, 1000);
}

function getWorkTime() {
    return focusInput.value * 60;
}

function getRestTime() {
    return breakInput.value * 60;
}

// Initialize
timeLeft = getWorkTime();
updateDisplay();
toggleButton.textContent = 'Take a Break';
document.querySelector('.timer').classList.add('work-mode');  // Set initial color

// Add event listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
toggleButton.addEventListener('click', toggleMode);

// Update input event listeners to immediately change the timer
focusInput.addEventListener('change', () => {
    if (isWorkMode) {  // Only update if we're in focus mode
        timeLeft = getWorkTime();
        updateDisplay();
    }
});

breakInput.addEventListener('change', () => {
    if (!isWorkMode) {  // Only update if we're in break mode
        timeLeft = getRestTime();
        updateDisplay();
    }
});

// Also update the input event to 'input' instead of 'change' for immediate response
focusInput.addEventListener('input', () => {
    if (isWorkMode && timerId === null) {  // Only update if we're in focus mode and timer isn't running
        timeLeft = getWorkTime();
        updateDisplay();
    }
});

breakInput.addEventListener('input', () => {
    if (!isWorkMode && timerId === null) {  // Only update if we're in break mode and timer isn't running
        timeLeft = getRestTime();
        updateDisplay();
    }
}); 