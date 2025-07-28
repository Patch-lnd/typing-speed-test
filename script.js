document.addEventListener('DOMContentLoaded', () => {
  const textDisplay = document.getElementById('text-display');
  const textInput = document.getElementById('text-input');
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');
  const wpmDisplay = document.getElementById('wpm');
  const accuracyDisplay = document.getElementById('accuracy');
  const timeDisplay = document.getElementById('time');

  const sampleTexts = [
    "the wind carried the scent of pine as the sun dipped below the distant hills, casting long shadows across the quiet valley where a single deer moved silently through the tall grass, pausing only to listen for the soft rustle of leaves in the trees above",
    "time passes slowly when you're waiting for something to change, yet so quickly when you look back and realize how much has already happened without you even noticing the moments slipping quietly through your hands like grains of sand",
    "a cold breeze swept through the empty streets as rain began to fall gently, tapping against windows and rooftops, blurring the lights of the city into glowing streaks of orange and white, like a painting smudged by careless hands",
    "sometimes the hardest thing isn't knowing what to do next, but having the patience to keep moving forward even when everything feels uncertain and the path ahead is hidden by fog and fear and doubt that seem too heavy to carry",
    "light filters through the trees, casting patterns on the forest floor where insects buzz and birds call to one another in bursts of song, as if the world is singing a secret language you were never taught but somehow still understand",
    "the stars blinked above the quiet desert where the sand kept secrets from ancient times, and the air was so still you could almost hear the sky breathing as night unfolded like a slow and endless dream across the earth",
    "in the silence between moments we find meaning, not in the noise or the rush, but in the pause, the breath, the glance that lingers a second longer than expected, the feeling that something invisible is always guiding us forward",
  ];

  let timer;
  let timeLeft = 25;
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

    const elapsedTime = (25 - timeLeft) / 25;
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
    timeLeft = 25;
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
    timeDisplay.textContent = '25';
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
