# React 18 Starter with Gemini API

This is a starter project for building modern, theme-aware React applications. It's set up with a modular structure, a powerful design system, and is ready for you to integrate the Gemini API.

## What's Inside? (ELI10 Version)

Imagine you're building with LEGOs. This project gives you a super organized box of special LEGO pieces to build an amazing app.

-   **`index.html`**: The front door to our app.
-   **`index.tsx`**: The main brain of the app.
-   **`importmap.js`**: A map that tells our app where to find its tools (like React).
-   **`Theme.tsx`**: The "master closet" for our app's style (colors, fonts, etc.).
-   **`hooks/`**: Special tools (custom hooks).
    -   `useBreakpoint.tsx`: Checks if you're on a phone, tablet, or desktop.
    -   `useElementAnatomy.tsx`: A special ruler that precisely measures a component and its inner parts.
-   **`types/`**: A dictionary for our app's data shapes.
    -   `index.tsx`: Defines what a "Window" or a "Log Entry" looks like.
-   **`components/`**: The LEGO pieces themselves, organized by complexity!
    -   **`Core/`**: The most basic, single-purpose pieces (Button, Input, Toggle, etc.).
    -   **`Package/`**: Combines Core pieces into something more useful (`ControlPanel`, `FloatingWindow`).
    -   **`Section/`**: A whole section of the app (the `Dock` at the bottom, the main `Stage`).
    -   **`Page/`**: A full screen you see (`Welcome` page).
    -   **`App/`**: The complete, running application (`MetaPrototype`).
-   **`README.md`**: This file! Your friendly guide.
-   **`LLM.md`**: Special instructions for AI helpers.
-   **`noteBook.md`**: A diary of tasks and progress.
-   **`bugReport.md`**: A list of bugs to fix.

## Directory Tree

```
.
├── components/
│   ├── App/
│   │   └── MetaPrototype.tsx
│   ├── Core/
│   │   ├── Button.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── DockIcon.tsx
│   │   ├── Input.tsx
│   │   ├── LogEntry.tsx
│   │   ├── RangeSlider.tsx
│   │   ├── Select.tsx
│   │   ├── StateLayer.tsx
│   │   ├── TextArea.tsx
│   │   ├── ThemeToggleButton.tsx
│   │   └── Toggle.tsx
│   ├── Package/
│   │   ├── CodePanel.tsx
│   │   ├── ConsolePanel.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── FloatingWindow.tsx
│   │   └── UndoRedo.tsx
│   ├── Page/
│   │   └── Welcome.tsx
│   └── Section/
│       ├── Dock.tsx
│       └── Stage.tsx
├── hooks/
│   ├── useBreakpoint.tsx
│   └── useElementAnatomy.tsx
├── types/
│   └── index.tsx
├── README.md
├── LLM.md
├── noteBook.md
├── bugReport.md
├── Theme.tsx
├── importmap.js
├── index.html
├── index.tsx
├── metadata.json
```

## How to Get Started

1.  Open the `index.html` file in a modern web browser.
2.  That's it! The app will run.
3.  Start changing the code in the `.tsx` files to build your own features.