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
    ],
    ar: [
      'القراءة عادة جميلة تفتح أمامنا أبوابا جديدة من المعرفة. عندما نقرأ كل يوم نتعلم كلمات جديدة ونفهم العالم من حولنا بشكل أفضل.',
      'في الصباح الباكر خرج أحمد إلى الحديقة ليشرب قهوته ويستمع إلى أصوات العصافير. كان الجو هادئا والشمس تشرق ببطء فوق الأشجار.',
      'تعلم البرمجة يحتاج إلى صبر وتدريب مستمر. ابدأ بمشروع صغير ثم أضف إليه خطوة بعد خطوة حتى يصبح برنامجا مفيدا.',
      'سافرنا في الصيف إلى مدينة قريبة من البحر. كنا نسبح في النهار ونجلس على الشاطئ في المساء ونتحدث حتى وقت متأخر.'
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

  function countNewInput(target, before, after) {
    let common = 0;
    while (common < before.length && common < after.length && before[common] === after[common]) common++;
    let keystrokes = 0;
    let mistakes = 0;
    for (let i = common; i < after.length; i++) {
      keystrokes++;
      if (after[i] !== target[i]) mistakes++;
    }
    return { keystrokes, mistakes };
  }

  function correctCount(target, typed) {
    let count = 0;
    for (let i = 0; i < typed.length && i < target.length; i++) {
      if (typed[i] === target[i]) count++;
    }
    return count;
  }

  function stats({ target, typed, elapsedMs, keystrokes, mistakes }) {
    const minutes = elapsedMs / 60000;
    const correct = correctCount(target, typed);
    const wpm = minutes > 0 ? Math.round(correct / 5 / minutes) : 0;
    const accuracy = keystrokes > 0 ? Math.round(((keystrokes - mistakes) / keystrokes) * 100) : 100;
    return { wpm, accuracy: Math.max(0, accuracy), correct };
  }

  function isFinished(target, typed) {
    return typed.length >= target.length;
  }

  return { PASSAGES, charStates, toRuns, countNewInput, correctCount, stats, isFinished };
});
