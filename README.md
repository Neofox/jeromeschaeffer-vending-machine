# Vending Machine

A vending machine simulator built with React, TypeScript and Tailwind CSS.
This project was made as a interview exercise.

## Technology Stack and versions

- **UI**: React v19.1
- **TypeScript**: v5.8
- **Build Tool**: Vite v7
- **Runtime**: Bun v1.2
- **Styling**: Tailwind CSS v4.1
- **Testing**: Bun test runner
- **Linting**: ESLint v9

## How to Run

### Prerequisites

#### Option 1: Using Bun (Recommended)

- **Bun** v1.2.0 or higher

#### Option 2: Using Node.js/npm

- **Node.js** v22.0 or higher
- **npm** v10.0 or higher

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Neofox/jeromeschaeffer-vending-machine.git
   cd jeromeschaeffer-vending-machine
   ```

#### Using Bun (Recommended)

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Start the development server**

   ```bash
   bun run dev
   ```

   The application will be available at `http://localhost:5173`

#### Using Node.js/npm

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Useful Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run test` - Run tests

## Project Structure

```text
src/
├── components/               # React components
├── store/
│   └── index.ts              # Zustand store with state management
├── utils/
│   ├── payment.ts            # Payment calculation utilities
│   ├── payment.test.ts       # Payment utility tests (use bun test)
│   └── cn.ts                 # Class name utility
├── main.tsx                  # App entry point
└── index.css                 # Styles (tailwindcss)
```

## State Management

The application uses **Zustand** for state management.
A state-machine-like pattern was chosen and **ts-pattern** was used for pattern matching the states.

### Machine States

1. **`idle`**
   - Default state when no interaction is happening
   - User can select products
   - All products are displayed with their prices and stock

2. **`awaiting-payment`**
   - Triggered when a user selects an available product
   - Tracks the selected product and amount of money inserted
   - User can insert cash, pay by card, or cancel the order
   - Progresses to `dispensing` state

3. **`dispensing`**
   - Product or change is being dispensed
   - Tracks whether the user has taken the item and change
   - User must collect both item and change (if any) to return to `idle`

4. **`error`**
   - Handles various error conditions (invalid product, out of stock, payment failures)
   - Stores the previous state to allow recovery
   - May include change to be returned to the user

### Store Actions

- `selectProduct(productId)` - Select a product for purchase
- `insertCash(money)` - Insert coins or bills (fail 10% of the time)
- `payByCard()` - Process card payment (async simulation, fail 20% of the time)
- `takeItem()` - Collect only the dispensed item
- `takeChange()` - Collect only the change
- `resetFromError()` - Recover from error state
- `cancelOrder()` - Cancel current order and return inserted money
