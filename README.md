# Vine'L - Vine Trivia Game

<div align="center">
  <h1>Vine'L</h1>
  <p>A daily trivia game based on popular Vine videos</p>
</div>

## 🎮 Game Modes

### Daily Mode
- 5 questions per day
- 1000 points per question
- Multiple choice format
- One attempt per day
- Compare your score with other players

### Hard Mode
- Same questions as Daily mode
- Bonus 500 points if you get it before 3 seconds
- 6-second grace period
- Score penalty of -110 points per second after grace period
- Minimum score of 100 points per question
- Perfect for speed runners!

### Endless Mode
- Play until you make a mistake
- Questions from previous days
- Daily mode scoring rules
- Track your high scores
- Practice makes perfect!

### Clean Mode
- Family-friendly version
- No foul language
- Same questions as Daily mode
- Available alongside daily challenges

### Archive Mode
- Access to all previous questions
- Practice with past challenges
- No stats saved
- Perfect for practice

## 🎯 Scoring System

The scoring system is based on both speed and correctness:
- Base score: 1000 points per correct answer
- 6-second grace period
- After grace period: -110 points per second
- Minimum score: 100 points per question
- Maximum score: 1000 points per question

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account and project setup

### Required Environment Variables
Create a `.env` file in the root directory with the following:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd react-trivia-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

Required dependencies include:
- `react` and `react-dom`
- `firebase` for database and authentication
- `jotai` for state management
- `react-router-dom` for routing
- `sass` for styling
- `@types/react` and `@types/react-dom` for TypeScript support

3. Firebase Setup:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Set up security rules for your Firestore database
   - Add your Firebase configuration to the `.env` file

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
# or
yarn build
```

The build process will:
- Compile TypeScript to JavaScript
- Bundle all assets
- Minify the code
- Generate production-ready files in the `dist` directory

### Common Issues and Solutions

1. **Firebase Connection Issues**
   - Ensure all environment variables are correctly set
   - Check Firebase security rules
   - Verify Firebase project is properly initialized

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript version compatibility
   - Ensure all dependencies are up to date

3. **Development Server Issues**
   - Check if port 5173 is available
   - Clear browser cache
   - Try running with `--force` flag: `npm run dev --force`

## 🛠️ Technologies Used

- React
- TypeScript
- Firebase (Firestore)
- SCSS Modules
- React Router
- Jotai (State Management)

## 🌟 Features

- Daily challenges with new questions
- Multiple game modes for different play styles
- Real-time score tracking
- Share results with friends
- Historical performance tracking
- Clean and intuitive UI
- Responsive design

## 📱 Share Your Results

After completing a quiz, you can share your results in a Wordle-style format:
- Shows your score and accuracy
- Visual grid of correct/incorrect answers
- Easy to copy and share

## 🕒 Time Zone

All game operations are based on Central Time (America/Chicago) to ensure consistent daily resets and fair play.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Inspired by popular trivia games - Wordle, Timeguessr, Costcodel