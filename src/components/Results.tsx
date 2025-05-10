import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { resultsAtom, gameModeAtom, correctAnswersAtom, currentQuestionIdxAtom, resetQuizAtom } from '../atoms';
import styles from './Results.module.scss';
import { useEffect, useState } from 'react';

function Results() {
  const [results] = useAtom(resultsAtom);
  const [gameMode] = useAtom(gameModeAtom);
  const [correctAnswers] = useAtom(correctAnswersAtom);
  const [questionIdx] = useAtom(currentQuestionIdxAtom);
  const [, resetQuiz] = useAtom(resetQuizAtom);
  const [, setResults] = useAtom(resultsAtom);
  const navigate = useNavigate();
  const [shareText, setShareText] = useState('');

  const handleReturnHome = () => {
    setResults([]);
    resetQuiz();
    navigate('/');
  };

  // Handle no results or no questions
  if (results.length === 0 || questionIdx === 0) {
    return (
      <div className={styles.resultsContainer}>
        <h1>No questions available for this mode/day.</h1>
        <button onClick={handleReturnHome} className={styles.homeButton}>
          Return Home
        </button>
      </div>
    );
  }

  useEffect(() => {
    // Generate share text in Wordle style
    const generateShareText = () => {
      const totalQuestions = results.length;
      const percentage = Math.round((correctAnswers / totalQuestions) * 100);
      const date = new Date().toLocaleDateString();
      
      let text = `Vine'L ${gameMode} ${date}\n`;
      text += `${correctAnswers}/${totalQuestions} ${percentage}%\n\n`;

      // Add emoji grid
      results.forEach((result, index) => {
        text += result.wasCorrect ? '🟩' : '🟥';
        if ((index + 1) % 5 === 0) text += '\n';
      });

      return text;
    };

    setShareText(generateShareText());
  }, [results, gameMode, correctAnswers]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const calculateScore = (result: any) => {
    if (!result.wasCorrect) return 0;
    if (result.timeTaken === undefined) return 1000;
    const timePenalty = Math.trunc(Math.max(0, result.timeTaken - 6) * 110);
    return Math.max(100, 1000 - timePenalty);
  };

  const totalScore = results.reduce((sum, result) => sum + calculateScore(result), 0);

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.header}>
        <h1>Vine'L {gameMode}</h1>
        <div className={styles.stats}>
          <div>Score: {totalScore}</div>
          <div>Correct: {correctAnswers}/{questionIdx}</div>
          <div>Accuracy: {Math.round((correctAnswers / questionIdx) * 100)}%</div>
        </div>
      </div>

      <div className={styles.shareSection}>
        <h2>Share Your Results</h2>
        <div className={styles.shareText}>{shareText}</div>
        <button onClick={handleShare} className={styles.shareButton}>
          Copy to Clipboard
        </button>
      </div>

      <div className={styles.questionGrid}>
        {results.map((result, index) => (
          <div key={index} className={styles.questionRow}>
            <div className={`${styles.questionBox} ${result.wasCorrect ? styles.correct : styles.incorrect}`}>
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.detailsSection}>
        <h2>Question Details</h2>
        {results.map((result, index) => (
          <div key={index} className={styles.detailRow}>
            <span>Question {index + 1}</span>
            <span>{result.wasCorrect ? '✅' : '❌'}</span>
            <span>{result.timeTaken ? `${result.timeTaken.toFixed(1)}s` : 'N/A'}</span>
            <span>{calculateScore(result)} pts</span>
          </div>
        ))}
      </div>

      <button onClick={handleReturnHome} className={styles.homeButton}>
        Return Home
      </button>
    </div>
  );
}

export default Results; 