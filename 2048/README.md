# 2048

> Slide and merge numbered tiles until you reach 2048

### [View Live Demo](https://fadyehabamer.github.io/games/2048/)

## Overview

The classic 4x4 sliding puzzle. Every move slides all tiles as far as they go, and two equal tiles that collide merge into one. A tile can only merge once per move, so a row of `2 2 2 2` becomes `4 4`, not `8`. The score goes up by the value of each merged tile and the best score is kept in `localStorage`.

## Controls

- Arrow keys, or swipe on the board
- `U` or the Undo button takes back the last move (one step only)
- New game starts over

## Built With

**Languages:** HTML · CSS · JavaScript

No libraries. The game rules live in `rules.js` with no DOM access, so they can be tested in Node.

## Techniques Demonstrated

- CSS grid board with `aspect-ratio`
- Pointer events for swipe detection
- Keyframe animations that switch off under `prefers-reduced-motion`
- `role="status"` announcements for win and game over

## Files

```
index.html
main.js
rules.js
rules.test.js
style.css
```

## Run Locally

```bash
git clone https://github.com/fadyehabamer/games.git
cd games/2048
node --test
```

Then open `index.html` in your browser.

**Topics:** `javascript` `javascript-game` `2048`

---
↩ Part of the [**games**](../) collection · [all my repos](https://github.com/fadyehabamer?tab=repositories) · [@fadyehabamer](https://github.com/fadyehabamer)
