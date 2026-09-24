(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.TypingRules = api;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const PASSAGES = {
    en: [
      'The best way to get faster at typing is to slow down first. Keep your eyes on the screen, trust your fingers and let the speed come on its own.',
      'A small boat drifted across the lake while the sun went down behind the hills. Nobody on the shore said a word until the last light was gone.',
      'Good code is easy to read and easy to change. Pick clear names, keep functions short and write a test before you fix a bug.',
      'Rain tapped on the window all afternoon, so we made tea, found an old board game in the cupboard and forgot about the time.'
    ]
  };

  function charStates(target, typed) {
    const states = [];
    for (let i = 0; i < target.length; i++) {
      if (i < typed.length) states.push(typed[i] === target[i] ? 'correct' : 'incorrect');
      else if (i === typed.length) states.push('current');
      else states.push('pending');
    }
    return states;
  }

  function toRuns(target, states) {
    const runs = [];
    for (let i = 0; i < target.length; i++) {
      const last = runs[runs.length - 1];
      if (last && last.state === states[i]) last.text += target[i];
      else runs.push({ state: states[i], text: target[i] });
    }
    return runs;
  }

  return { PASSAGES, charStates, toRuns };
});
