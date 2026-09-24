# Snake

> Classic Snake on a canvas, with keyboard and touch controls

### [View Live Demo](https://fadyehabamer.github.io/games/Snake/)

## Overview

Steer the snake to the food, grow a cell each time you eat and avoid the walls and your own tail. Every piece of food makes the game a little faster, down to a fixed floor. The high score is kept in `localStorage`.

Turns are queued, and each one is checked against the direction before it, so hitting Up then Left quickly while moving right won't fold the snake back onto itself.

## Controls

- Arrow keys or WASD to steer
- Space or P to pause, Enter to play again after a game over
- On touch screens, swipe on the board or use the arrow buttons under it
- The game pauses itself when you switch tabs

## Built With

**Languages:** HTML · CSS · JavaScript

No libraries. `rules.js` holds the game state and has no DOM access, so it runs under Node for the tests.

## Techniques Demonstrated

- Canvas 2D drawing sized for the device pixel ratio
- Pointer events for swipe steering
- A `setTimeout` game loop whose delay depends on the score
- Food animation that stays still under `prefers-reduced-motion`

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
cd games/Snake
node --test
```

Then open `index.html` in your browser.

**Topics:** `javascript` `javascript-game` `canvas` `snake`

---
↩ Part of the [**games**](../) collection · [all my repos](https://github.com/fadyehabamer?tab=repositories) · [@fadyehabamer](https://github.com/fadyehabamer)
