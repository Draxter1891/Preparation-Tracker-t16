# Interview Practice Tracker

A small dashboard for tracking your weekly interview preparation. You log practice problems, mark their progress, and see your completion percentage update. Everything is saved in your browser, so there is no account and no backend.

## What it does

- Shows totals for all problems, DSA, interview questions (Technical and Git), and machine coding.
- Lets you add, edit and delete problems with a title, category, difficulty, status, optional link and optional notes.
- Filters by category, status and difficulty, and searches title, notes and category.
- Sorts by most recent, oldest, hardest first, or title.
- Shows overall completion as a circular chart and a progress bar.
- Keeps your data after a page refresh using localStorage.
- Works on phones and desktops.
- Shows an empty state, a no-results state, and form error messages.

## Requirements

- Node.js 18 or newer
- npm

## Setup

```
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

Other commands:

```
npm run build     # production build into /dist
npm run preview   # serve the production build locally
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Weekly overview: progress, stat cards, and the full problem list |
| `/questions` | The full problem list on its own |
| `/machine-coding` | Only Machine Coding and Technical problems |
| `/analytics` | Completion by category, difficulty and status, plus all notes |

## How data is stored

All problems live in one React Context (`PracticeContext`). Every change is written to localStorage under the key `prep-tracker:v1`. On load, the app reads that key and starts from it.

To reset everything, delete that key in your browser dev tools (Application > Local Storage), or clear site data. If the list is empty, the app offers a "Load sample data" button.

Data stays in the browser you used. It does not sync across devices or browsers.

## Validation rules

- Title: required, 3 to 120 characters.
- Link: optional, must start with http:// or https://.
- Notes: optional, up to 240 characters.

## Project structure

```
src/
├── main.jsx                  App entry, wraps the router in the provider
├── router.jsx                Route definitions (createBrowserRouter)
├── index.css                 Tailwind setup and shared styles
│
├── context/
│   └── PracticeContext.jsx   State, localStorage sync, stats, add/edit/delete
│
├── components/
│   ├── Layout.jsx            Header, navigation, footer, export button
│   ├── Tracker.jsx           Search, filters, sorting, and the problem list
│   ├── QuestionForm.jsx      Add and edit form (react-hook-form)
│   ├── ProgressHero.jsx      Circular progress and completion bar
│   ├── StatCard.jsx          Single stat tile
│   └── Badge.jsx             Difficulty and category labels
│
└── pages/
    ├── Overview.jsx
    ├── Questions.jsx
    ├── MachineCoding.jsx
    ├── Analytics.jsx
    └── ErrorPages.jsx        Error and 404 screens
```

## Tech stack

- React 18 with Vite
- React Router (data router, `createBrowserRouter`)
- React Context API for shared state
- React Hook Form for the form
- Tailwind CSS 3 for styling
- lucide-react for icons
- react-circular-progressbar for the progress chart

## Known limitations

- The completion percentage is based on the problems you have logged, not on a fixed weekly target.
- "Completed" only means you checked it off. The app does not measure how well you know the problem.
- Export Summary downloads a JSON file only.
- There are no automated tests yet.