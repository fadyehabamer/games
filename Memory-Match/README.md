# Memory-Match

> Flip cards two at a time and find all eight pairs

### [View Live Demo](https://fadyehabamer.github.io/games/Memory-Match/)

## Overview

Sixteen face-down cards, eight pairs. Turn over two cards per move; a pair stays up, anything else flips back after a moment (or straight away if you pick another card). The timer starts on your first flip. Your best result, fewest moves first and time as the tie-breaker, is saved in `localStorage`.

## Controls

- Click or tap a card to flip it
- Tab into the grid, then use the arrow keys, Home and End to move between cards
- Enter or Space flips the focused card

## Built With

**Languages:** HTML · CSS · JavaScript

No libraries. The deck and matching logic sit in `rules.js`, separate from the DOM code in `main.js`.

## Techniques Demonstrated

- CSS 3D card flip with `backface-visibility`
- Roving `tabindex` for grid keyboard navigation
- Card state exposed through `aria-label`, results through `role="status"`
- `prefers-reduced-motion` turns the flip into an instant swap

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
cd games/Memory-Match
node --test
```

Then open `index.html` in your browser.

**Topics:** `javascript` `javascript-game` `memory-game`

---
↩ Part of the [**games**](../) collection · [all my repos](https://github.com/fadyehabamer?tab=repositories) · [@fadyehabamer](https://github.com/fadyehabamer)
