# Arabic-Wordle

> Guess the daily five-letter Arabic word in six tries

### [View Live Demo](https://fadyehabamer.github.io/games/Arabic-Wordle/)

## Overview

A Wordle-style game in Arabic. The whole page is right-to-left, so the first letter of each guess sits on the right. After each guess the tiles turn green (right letter, right place), yellow (in the word, somewhere else) or grey (not in the word), and the on-screen keyboard keeps the best colour it has seen for each letter.

Repeated letters are scored the same way as the original: exact matches are counted first, and a letter is only marked yellow as many times as it is still unused in the answer.

Everyone gets the same word on the same day. It comes from a short bundled list of common words and changes at local midnight. Today's guesses are saved in `localStorage`, and once you finish you can copy a spoiler-free result made of coloured squares.

Guesses are not checked against a dictionary, any five letters are accepted.

## Controls

- Tap the on-screen keyboard, or type on a physical keyboard
- With an Arabic layout, letters come through as typed. With an English layout, keys are read by position on the standard Arabic layout (F is ب, J is ت and so on)
- Enter submits, Backspace deletes

## Built With

**Languages:** HTML · CSS · JavaScript

No libraries. `rules.js` holds the word list, scoring, daily word and share text, with no DOM code, so it runs under Node for the tests.

## Techniques Demonstrated

- `lang="ar"` and `dir="rtl"` layout with CSS grid
- `KeyboardEvent.code` mapping for users on a Latin keyboard layout
- Clipboard API with a select-and-copy fallback
- Tile reveal and shake animations that switch off under `prefers-reduced-motion`
- `role="status"` announcements for each guess and the result

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
cd games/Arabic-Wordle
node --test
```

Then open `index.html` in your browser.

**Topics:** `javascript` `javascript-game` `wordle` `arabic` `rtl`

---
↩ Part of the [**games**](../) collection · [all my repos](https://github.com/fadyehabamer?tab=repositories) · [@fadyehabamer](https://github.com/fadyehabamer)
