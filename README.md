# WebLN Boost Widget

A customizable React component for Lightning Network donations using WebLN. This widget provides a smooth and intuitive interface for making Lightning Network payments.

## Features

- 🎨 Modern and responsive design
- ⚡ WebLN integration for Lightning Network payments
- 💸 Preset and custom amount selection
- 📝 Optional note addition
- 🔄 Press-and-hold boost functionality
- 📱 Mobile-friendly interface

## Installation

```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

## Usage

```typescript
import WebLNBoostButton from './components/webln-boost-button'

function App() {
  return (
    <WebLNBoostButton
      defaultAmount={100}
      incrementSpeed={50}
      incrementValue={10}
    />
  )
}
```

## Props

- `defaultAmount`: Initial amount in sats (default: 100)
- `incrementSpeed`: Speed of increment when holding boost button in ms (default: 50)
- `incrementValue`: Amount to increment per tick when holding (default: 10)

## Requirements

- A WebLN-compatible wallet (e.g., Alby)
- Node.js 18.0.0 or later

## License

MIT
