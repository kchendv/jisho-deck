# Japanese Flashcard App

A beautiful, modern Progressive Web App for learning Japanese vocabulary with flashcards.

## Features

- **Flashcard Management**: Add, edit, delete, and shuffle flashcards
- **Rich Card Data**: Each card includes Kanji, Hiragana, Katakana, definition, pronunciation, and JLPT level
- **Collections**: Organize flashcards into custom collections with color coding
- **Jisho.org Integration**: 
  - Quick search to auto-fill card details
  - Direct links to Jisho.org for deeper learning
- **Study Modes**:
  - Study all cards
  - Study by collection
  - Shuffle mode for randomized practice
- **Interactive 3D Card Flips**: Smooth animations when flipping cards
- **CSV Export**: Export all your flashcards to CSV format
- **Responsive Design**: Works beautifully on desktop and mobile
- **Dark Mode Support**: Automatic theme switching
- **Local Storage**: All data persists in your browser

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **Cheerio** - Web scraping for Jisho.org
- **Local Storage** - Data persistence

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Adding Flashcards

1. Click the **+** button in the bottom right
2. Search for a Japanese word on Jisho.org or enter details manually
3. Add the card to collections (optional)
4. Click "Add Flashcard"

### Creating Collections

1. Click the **Library** button (second floating button)
2. Enter a collection name and description
3. Choose a color
4. Click "Create Collection"

### Studying

1. Navigate to "Study Mode" to study all cards
2. Click "Study" on a specific collection to study just those cards
3. Click the card to flip between front (Japanese) and back (English)
4. Use Previous/Next buttons to navigate

### Exporting Data

Click the "Export CSV" button in the header to download all your flashcards as a CSV file.

## License

MIT
