document.addEventListener('DOMContentLoaded', () => {
  const textDisplay = document.getElementById('text-display');
  const textInput = document.getElementById('text-input');
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');
  const wpmDisplay = document.getElementById('wpm');
  const accuracyDisplay = document.getElementById('accuracy');
  const timeDisplay = document.getElementById('time');

  const sampleTexts = [
    "The wind carried the scent of pine as the sun dipped below the distant hills, casting long shadows across the quiet valley where a single deer moved silently through the tall grass, pausing only to listen for the soft rustle of leaves in the trees above.",
    "Time passes slowly when you're waiting for something to change, yet so quickly when you look back and realize how much has already happened without you even noticing the moments slipping quietly through your hands like grains of sand.",
    "A cold breeze swept through the empty streets as rain began to fall gently, tapping against windows and rooftops, blurring the lights of the city into glowing streaks of orange and white, like a painting smudged by careless hands.",
    "Sometimes the hardest thing isn't knowing what to do next, but having the patience to keep moving forward even when everything feels uncertain and the path ahead is hidden by fog and fear and doubt that seem too heavy to carry."
  ];

  let timer;
  let timeLeft = 30;
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

    const elapsedTime = (30 - timeLeft) / 30;
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
    timeLeft = 30;
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
    timeDisplay.textContent = '30';
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
