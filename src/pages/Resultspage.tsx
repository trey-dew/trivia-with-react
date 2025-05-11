import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { resultsAtom, gameModeAtom, correctAnswersAtom, currentQuestionIdxAtom, selectedArchiveDayAtom, userId, hasSubmitted, resetQuizAtom } from '../atoms';
import styles from './Resultspage.module.scss';
import { useEffect, useState, useRef } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Helper function to get Central Time date string
const getCentralTimeDateString = (date: Date = new Date()): string => {
  const centralTime = new Date(date.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  return centralTime.toISOString().split('T')[0];
};

function Resultspage() {
  const [results] = useAtom(resultsAtom);
  const [gameMode] = useAtom(gameModeAtom);
  const [correctAnswers] = useAtom(correctAnswersAtom);
  const [questionIdx] = useAtom(currentQuestionIdxAtom);
  const [selectedArchiveDay] = useAtom(selectedArchiveDayAtom);
  const [userIdValue] = useAtom(userId);
  const [hasSubmittedToday] = useAtom(hasSubmitted);
  const navigate = useNavigate();
  const [shareText, setShareText] = useState('');
  const [averageCorrectAnswers, setAverageCorrectAnswers] = useState<number | null>(null);
  const [averagePercentage, setAveragePercentage] = useState<number | null>(null);
  const resultsSentRef = useRef(false);
  const [, resetQuiz] = useAtom(resetQuizAtom);
  const [, setResults] = useAtom(resultsAtom);

  const handleReturnHome = () => {
    setResults([]);
    resetQuiz();
    navigate('/');
  };

  useEffect(() => {
    const fetchAverageStats = async () => {
      try {
        let dayString: string;
  
        if (gameMode === 'Archive' && selectedArchiveDay !== null) {
          const baseDate = new Date(2025, 4, 8);
          baseDate.setDate(baseDate.getDate() + selectedArchiveDay);
          dayString = getCentralTimeDateString(baseDate);
        } else {
          dayString = getCentralTimeDateString();
        }
       
        const q = query(
          collection(db, 'quizResults'),
          where('dayString', '==', dayString),
          where('gameMode', '==', 'Daily')
        );
  
        const querySnapshot = await getDocs(q);
  
        let totalCorrect = 0;
        let totalPercentage = 0;
        let count = 0;
  
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (typeof data.correctAnswers === 'number' && typeof data.percentage === 'number') {
            totalCorrect += data.correctAnswers;
            totalPercentage += data.percentage;
            count += 1;
          }
        });
  
        if (count > 0) {
          setAverageCorrectAnswers(totalCorrect / count);
          setAveragePercentage(totalPercentage / count);
        } else {
          setAverageCorrectAnswers(null);
          setAveragePercentage(null);
        }
      } catch (error) {
        console.error('Error fetching average stats:', error);
      }
    };
  
    fetchAverageStats();
  }, [gameMode, selectedArchiveDay]);

  const sendResultsToFirestore = async () => {
    if (results.length === 0 || gameMode === 'Archive') {
      return;
    }

    try {
      const finalScore = calculateFinalScore(results);
      const percentage = Math.trunc((correctAnswers / questionIdx) * 100);
      const now = new Date();
      const dayString = getCentralTimeDateString(now);

      const resultsWithValidData = results.map((res) => ({
        ...res,
        timeTaken: res.timeTaken !== undefined ? res.timeTaken : 0,
      }));

      await addDoc(collection(db, 'quizResults'), {
        date: getCentralTimeDateString(now),
        dayString,
        gameMode,
        correctAnswers,
        userId: userIdValue,
        incorrectAnswers: questionIdx - correctAnswers,
        totalQuestions: questionIdx,
        finalScore,
        percentage,
        results: resultsWithValidData,
      });

      resultsSentRef.current = true;
    } catch (error) {
      console.error('Error saving results to Firestore:', error);
      resultsSentRef.current = false;
    }
  };

  useEffect(() => {
    if (!resultsSentRef.current && !hasSubmittedToday && results.length > 0) {
      resultsSentRef.current = true;
      sendResultsToFirestore();
    }
  }, [results]);

  useEffect(() => {
    // Generate share text in Wordle style
    const generateShareText = () => {
      const totalQuestions = results.length;
      const percentage = Math.round((correctAnswers / totalQuestions) * 100);
      const date = new Date().toLocaleDateString('en-US', { timeZone: 'America/Chicago' });
      
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

  const calculateFinalScore = (results: any[]) => {
    return results.reduce((total, res) => {
      if (res.wasCorrect) {
        if(res.timeTaken !== undefined) {
          const timePenalty = Math.trunc(Math.max(0, res.timeTaken - 6) * 110);
          const baseScore = Math.max(100, 1000 - timePenalty);
          // Add 500 point bonus for answers under 3 seconds in Hard mode
          const speedBonus = gameMode === 'Hard' && res.timeTaken < 3 ? 500 : 0;
          return total + baseScore + speedBonus;
        } else {
          return total + 1000;
        }
      }
      return Math.trunc(total);
    }, 0);
  };

  const totalScore = calculateFinalScore(results);

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.header}>
        <h1>Vine'L {gameMode}</h1>
        {averageCorrectAnswers !== null && averagePercentage !== null ? (
          <div className={styles.stats}>
            <div>
              <h2>You scored: {Math.trunc(correctAnswers / questionIdx * 100)}%</h2>
              <h2>average: {Math.trunc(averagePercentage)}%</h2>
            </div>
            <div>
              <h2>Score: {totalScore} / {questionIdx * 1000}</h2>
              <h2>Average: {Math.trunc(averageCorrectAnswers * 1000)}</h2>
            </div>
          </div>
        ) : (
          <div className={styles.stats}>
            <div>
              <h2>You scored: {Math.trunc(correctAnswers / questionIdx * 100)}%</h2>
              <h2>No average data available</h2>
            </div>
            <div>
              <h2>Score: {totalScore} / {questionIdx * 1000}</h2>
              <h2>No average data available</h2>
            </div>
          </div>
        )}
      </div>

      <div className={styles.shareSection}>
        <h2>Share Your Results</h2>
        <div className={styles.shareText}>{shareText}</div>
        <button onClick={handleShare} className={styles.shareButton}>
          Copy to Clipboard
        </button>
      </div>

      <div className={styles.detailsSection}>
        <h2>Question Details</h2>
        {results.map((result, index) => (
          <div key={index} className={styles.detailRow}>
            <div className={styles.questionInfo}>
              <div className={styles.questionNumber}>Question {index + 1}</div>
              <div className={styles.questionText}>{result.question.question}</div>
            </div>
            <div className={styles.resultInfo}>
              <span>{result.wasCorrect ? '✅' : '❌'}</span>
              <span>{result.timeTaken ? `${result.timeTaken.toFixed(1)}s` : 'N/A'}</span>
              <span>{calculateFinalScore([result])} pts</span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleReturnHome} className={styles.homeButton}>
        Return Home
      </button>
    </div>
  );
}

export default Resultspage;