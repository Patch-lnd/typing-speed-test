document.addEventListener('DOMContentLoaded', () => {
  const textDisplay = document.getElementById('text-display');
  const textInput = document.getElementById('text-input');
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');
  const wpmDisplay = document.getElementById('wpm');
  const accuracyDisplay = document.getElementById('accuracy');
  const timeDisplay = document.getElementById('time');

  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "Programming is fun when you understand the logic.",
    "Typing fast requires both accuracy and practice.",
    "A journey of a thousand miles begins with a step.",
    "JavaScript is tricky but powerful when mastered.",
    "Errors are normal; they help us grow and learn.",
    "Djeumeni sanda vianey is the, creator and he merrits an XPPen Deco Pro MW.",
  ];

  let timer;
  let timeLeft = 60;
  let isTestRunning = false;
  let currentText = '';
  let totalTyped = 0;
  let correctTyped = 0;

  function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function renderText() {
    const inputText = textInput.value;
    let html = '';

    for (let i = 0; i < currentText.length; i++) {
      const currentChar = currentText[i];
      const typedChar = inputText[i];

      if (i < inputText.length) {
        if (typedChar === currentChar) {
          html += `<span class="correct">${escapeHTML(currentChar)}</span>`;
        } else {
          html += `<span class="incorrect">${escapeHTML(currentChar)}</span>`;
        }
      } else if (i === inputText.length) {
        html += `<span class="current">${escapeHTML(currentChar)}</span>`;
      } else {
        html += escapeHTML(currentChar);
      }
    }

    textDisplay.innerHTML = html;
  }

  function updateStats() {
    const inputText = textInput.value;
    totalTyped = inputText.length;
    correctTyped = 0;

    for (let i = 0; i < inputText.length; i++) {
      if (inputText[i] === currentText[i]) {
        correctTyped++;
      }
    }

    const elapsedTime = (60 - timeLeft) / 60;
    const wordsTyped = correctTyped / 5;
    const wpm = Math.round(wordsTyped / elapsedTime) || 0;
    const accuracy = totalTyped ? Math.round((correctTyped / totalTyped) * 100) : 0;

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = `${accuracy}%`;
  }

  function startTest() {
    if (isTestRunning) return;

    isTestRunning = true;
    textInput.disabled = false;
    textInput.focus();
    startBtn.disabled = true;
    resetBtn.disabled = false;
    textInput.value = '';

    currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    timeLeft = 60;
    timeDisplay.textContent = timeLeft;
    totalTyped = 0;
    correctTyped = 0;

    renderText();
    updateStats();

    timer = setInterval(() => {
      timeLeft--;
      timeDisplay.textContent = timeLeft;
      updateStats();

      if (timeLeft <= 0) {
        clearInterval(timer);
        isTestRunning = false;
        textInput.disabled = true;
        startBtn.disabled = false;
      }
    }, 1000);
  }

  function resetTest() {
    clearInterval(timer);
    isTestRunning = false;
    textInput.disabled = true;
    textInput.value = '';
    textDisplay.innerHTML = 'Click "Start Test" to begin...';
    startBtn.disabled = false;
    resetBtn.disabled = true;
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '0%';
    timeDisplay.textContent = '60';
  }

  textInput.addEventListener('input', () => {
    if (!isTestRunning) return;
    renderText();
    updateStats();

    if (textInput.value.length === currentText.length) {
      clearInterval(timer);
      isTestRunning = false;
      textInput.disabled = true;
      startBtn.disabled = false;
    }
  });

  startBtn.addEventListener('click', startTest);
  resetBtn.addEventListener('click', resetTest);
});
