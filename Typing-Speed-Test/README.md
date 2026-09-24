# Typing-Speed-Test

> Typing speed and accuracy test with English and Arabic passages

### [View Live Demo](https://fadyehabamer.github.io/games/Typing-Speed-Test/)

## Overview

Pick English or Arabic, then type the passage in the box. Every character is coloured as you go, green when it's right and red when it isn't, and the next character is underlined. The clock starts on your first key. Arabic passages switch the text and the input box to right-to-left.

WPM is the standard gross figure: correct characters divided by five, per minute. Accuracy counts every character you typed, so a mistake you go back and fix still counts against you. Pasting is turned off.

## Controls

- Type in the box under the passage
- Escape or Restart starts the same passage again
- New passage picks a different one in the same language

## Built With

**Languages:** HTML · CSS · JavaScript

No libraries. Passages, highlighting and scoring are in `rules.js`, which has no DOM code.

## Techniques Demonstrated

- `lang` and `dir` switched at runtime for Arabic
- Highlighting grouped into runs of spans so Arabic letters stay joined
- `role="status"` summary when you finish
- Blinking cursor that stops under `prefers-reduced-motion`

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
cd games/Typing-Speed-Test
node --test
```

Then open `index.html` in your browser.

**Topics:** `javascript` `typing-test` `arabic` `rtl`

---
↩ Part of the [**games**](../) collection · [all my repos](https://github.com/fadyehabamer?tab=repositories) · [@fadyehabamer](https://github.com/fadyehabamer)
