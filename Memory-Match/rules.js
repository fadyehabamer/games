(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.MemoryRules = api;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const SYMBOLS = [
    { key: 'star', glyph: '★' },
    { key: 'heart', glyph: '♥︎' },
    { key: 'diamond', glyph: '♦︎' },
    { key: 'club', glyph: '♣︎' },
    { key: 'spade', glyph: '♠︎' },
    { key: 'sun', glyph: '☀︎' },
    { key: 'umbrella', glyph: '☂︎' },
    { key: 'note', glyph: '♪' }
  ];

  function shuffle(list, rng = Math.random) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function createDeck(symbols = SYMBOLS, rng = Math.random) {
    const pairs = symbols.flatMap((symbol) => [
      { key: symbol.key, glyph: symbol.glyph, matched: false },
      { key: symbol.key, glyph: symbol.glyph, matched: false }
    ]);
    return shuffle(pairs, rng);
  }

  function createGame(symbols = SYMBOLS, rng = Math.random) {
    return { cards: createDeck(symbols, rng), open: [], moves: 0, matches: 0 };
  }

  function flip(game, index) {
    const card = game.cards[index];
    if (!card || card.matched || game.open.length >= 2 || game.open.includes(index)) {
      return { game, result: 'ignored' };
    }
    const open = game.open.concat(index);
    if (open.length < 2) {
      return { game: { ...game, open }, result: 'opened' };
    }
    const moves = game.moves + 1;
    const [a, b] = open;
    if (game.cards[a].key === game.cards[b].key) {
      const cards = game.cards.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c));
      return { game: { ...game, cards, open: [], moves, matches: game.matches + 1 }, result: 'match' };
    }
    return { game: { ...game, open, moves }, result: 'mismatch' };
  }

  function hideOpen(game) {
    return { ...game, open: [] };
  }

  function isComplete(game) {
    return game.matches * 2 === game.cards.length;
  }

  function isBetter(score, best) {
    if (!best) return true;
    if (score.moves !== best.moves) return score.moves < best.moves;
    return score.seconds < best.seconds;
  }

  return { isBetter, SYMBOLS, shuffle, createDeck, createGame, flip, hideOpen, isComplete };
});
