# Tic-Tac-Toe-AI

> Tic-tac-toe for two players, or against an unbeatable or an easy computer

### [View Live Demo](https://fadyehabamer.github.io/games/Tic-Tac-Toe-AI/)

## Overview

Play a friend on the same screen, or play the computer. The unbeatable computer uses minimax with alpha-beta pruning and prefers faster wins, so the best you can do against it is a draw. The easy computer just picks a random free square. You can choose to play X (first) or O (second). A scoreboard counts wins and draws until you change the mode.

The tests walk through every possible line of play against the minimax player, going first and second, and check that it never loses.

## Controls

- Click or tap a square
- Arrow keys move around the board, Enter or Space places a mark
- Keys 1 to 9 play a square directly, counting from the top left

## Built With

**Languages:** HTML · CSS · JavaScript

No libraries. `rules.js` has the board logic and the computer player, `main.js` the page.

## Techniques Demonstrated

- Minimax with alpha-beta pruning
- Roving `tabindex` with wrap-around arrow navigation
- Radio groups in fieldsets for the game options
- `role="status"` for turn and result announcements

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
cd games/Tic-Tac-Toe-AI
node --test
```

Then open `index.html` in your browser.

**Topics:** `javascript` `javascript-game` `minimax` `tic-tac-toe`

---
↩ Part of the [**games**](../) collection · [all my repos](https://github.com/fadyehabamer?tab=repositories) · [@fadyehabamer](https://github.com/fadyehabamer)
