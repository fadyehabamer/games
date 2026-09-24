(function () {
  const { PASSAGES, charStates, toRuns } = window.TypingRules;

  const passageEl = document.getElementById('passage');
  const inputEl = document.getElementById('input');

  let target = '';

  function pickPassage() {
    const list = PASSAGES.en;
    return list[Math.floor(Math.random() * list.length)];
  }

  function render() {
    const typed = inputEl.value;
    passageEl.textContent = '';
    toRuns(target, charStates(target, typed)).forEach((run) => {
      const span = document.createElement('span');
      span.className = run.state;
      span.textContent = run.text;
      passageEl.appendChild(span);
    });
  }

  inputEl.addEventListener('input', () => {
    if (inputEl.value.length > target.length) {
      inputEl.value = inputEl.value.slice(0, target.length);
    }
    render();
  });

  inputEl.addEventListener('paste', (event) => event.preventDefault());

  target = pickPassage();
  inputEl.value = '';
  render();
})();
