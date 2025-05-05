import Answer_module from './Answer.module.scss';
import Classnames from 'classnames';
import Reset_module from './Reset.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase'; // your firebase.ts should export db
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import TestUpload from '../fireStoreTestUpload'; 

import { useAtom } from 'jotai';
import {
  correctAnswersAtom,
  incorrectAnswersAtom,
  currentQuestionIdxAtom,
  resetQuizAtom,
  resultsAtom,
  gameModeAtom,
  selectedArchiveDayAtom,
  userId,
  hasSubmitted,
} from '../atoms';

function Reset() {
    const [results, setResults] = useAtom(resultsAtom)
    const [correctAnswers] = useAtom(correctAnswersAtom);
    const [questionIdx] = useAtom(currentQuestionIdxAtom);
    const [, resetQuiz] = useAtom(resetQuizAtom);
    const resultsSentRef = useRef(false);  
    const [averageCorrectAnswers, setAverageCorrectAnswers] = useState<number | null>(null);
    const [averagePercentage, setAveragePercentage] = useState<number | null>(null);
    const [gameMode] = useAtom(gameModeAtom);
    const [selectedArchiveDay] = useAtom(selectedArchiveDayAtom);
    const { dayId } = useParams();
    const [userIdValue] = useAtom(userId);
    const [hasSubmittedToday] = useAtom(hasSubmitted);

    // Debug logging for initial state
    console.log('Reset Component Mounted - Initial State:', {
        resultsLength: results.length,
        gameMode,
        hasSubmittedToday,
        resultsSentRef: resultsSentRef.current,
        userId: userIdValue,
        correctAnswers,
        questionIdx
    });

    const dayString = selectedArchiveDay !== null
    ? new Date(2025, 3, 20 + selectedArchiveDay).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAverageStats = async () => {
          try {
            let dayString: string;
      
            if (gameMode === 'Archive' && selectedArchiveDay !== null) {
              // Base date: April 20, 2025 (month is 0-indexed)
              const baseDate = new Date(2025, 3, 20);
              baseDate.setDate(baseDate.getDate() + selectedArchiveDay);
              dayString = baseDate.toISOString().split('T')[0];
            } else {
              // Default to today
              dayString = new Date().toISOString().split('T')[0];
            }
           
            const q = query(
              collection(db, 'quizResults'),
              where('dayString', '==', dayString),
              where('gameMode', '==', gameMode === 'Archive' ? 'Daily' : gameMode)
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
      }, [gameMode, selectedArchiveDay, userIdValue]);
      
    const handleReset = () => {
        console.log('handleReset called - Current State:', {
            resultsLength: results.length,
            resultsSentRef: resultsSentRef.current
        });
        setResults([]);
        resetQuiz();
        navigate('/');
        resultsSentRef.current = false;
    };

    const calculateFinalScore = (results: any[]) => {
        const score = results.reduce((total, res) => {
            if (res.wasCorrect) {
                if(res.timeTaken !== undefined) {
                    const timePenalty = Math.trunc(Math.max(0, res.timeTaken - 6) * 110);
                    const score = Math.max(100, 1000 - timePenalty);
                    return total + score;
                } else {
                    return total + 1000;
                }
            }
            return Math.trunc(total);
        }, 0);
        console.log('Final Score Calculated:', score);
        return score;
    };
    
    const sendResultsToFirestore = async () => {
        console.log('Attempting to send results - Pre-check State:', {
            resultsLength: results.length,
            gameMode,
            hasSubmittedToday,
            resultsSentRef: resultsSentRef.current
        });

        if (results.length === 0 || gameMode === 'Archive') {
            console.log('Results not sent - Conditions not met:', {
                resultsLength: results.length,
                gameMode
            });
            return;
        }

        try {
            const finalScore = calculateFinalScore(results);
            const percentage = Math.trunc((correctAnswers / questionIdx) * 100);
            const now = new Date();
            const dayString = now.toISOString().split('T')[0];

            const resultsWithValidData = results.map((res) => ({
                ...res,
                timeTaken: res.timeTaken !== undefined ? res.timeTaken : 0,
            }));

            console.log('Preparing to send to Firestore:', {
                dayString,
                gameMode,
                correctAnswers,
                userId: userIdValue,
                finalScore,
                percentage,
                resultsCount: resultsWithValidData.length
            });

            await addDoc(collection(db, 'quizResults'), {
                date: now.toISOString(),
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

            console.log('Results successfully saved to Firestore');
            resultsSentRef.current = true;
        } catch (error) {
            console.error('Error saving results to Firestore:', error);
            resultsSentRef.current = false;
        }
    };

    useEffect(() => {
        console.log('Results Effect Triggered - State:', {
            resultsLength: results.length,
            hasSubmittedToday,
            resultsSentRef: resultsSentRef.current,
            componentMounted: true
        });

        // Only attempt to send if we haven't sent before and have results
        if (!resultsSentRef.current && !hasSubmittedToday && results.length > 0) {
            console.log('Attempting to send results - Setting resultsSentRef to true');
            resultsSentRef.current = true; // Set this before sending to prevent duplicate sends
            sendResultsToFirestore();
        } else {
            console.log('Results not sent - Conditions not met:', {
                resultsSentRef: resultsSentRef.current,
                hasSubmittedToday,
                resultsLength: results.length
            });
        }

        // Cleanup function to prevent memory leaks
        return () => {
            console.log('Results Effect Cleanup');
        };
    }, [results]); // Remove hasSubmittedToday from dependencies to prevent extra triggers

    return (
        <div className={Reset_module['end-screen']}>
            {averageCorrectAnswers !== null && averagePercentage !== null ? (
              <div>
                <h1 className={Reset_module['reset-text']}>
                    You scored: {Math.trunc(correctAnswers / questionIdx * 100)}% The average was: {Math.trunc(averagePercentage)}% {gameMode}
                </h1>
                <h2 className={Reset_module['reset-text']}>
                  {calculateFinalScore(results)} / {questionIdx}000 Average was: {Math.trunc(averageCorrectAnswers * 1000)}
                </h2>
              </div>
              ) : (
                <h2>
                  No data </h2>
            )}
            <h2 className={Reset_module['reset-text']}>Results...</h2>
            {results.map((res,idx) => (
                <div key={idx} >
                    <p><strong>Q:</strong> {res.question.question} <strong>{res.wasCorrect ? '✅ Correct' : '❌ Incorrect'}</strong></p>
                    {res.timeTaken !== undefined && (
                    <p><strong>Time Taken:</strong> {res.timeTaken.toFixed(1)}s </p>
                    )}
                    {res.timeTaken !== undefined && (
                    <p><strong>Score:</strong> {
                        res.wasCorrect
                            ? Math.trunc(Math.max(100, 1000 - Math.max(0, res.timeTaken - 6) * 110))
                            : 0
                    }</p>
                    )}
                    {res.timeTaken === undefined && (
                    <p><strong>Score:</strong> {
                        res.wasCorrect
                            ? 1000
                            : 0
                    }</p>
                    )}
                    <hr />
                </div>
            ))}
            <button
                onClick={handleReset}
                className={Classnames(
                    Answer_module.answer,
                    Reset_module['next-btn'],
                    Reset_module['reset-btn']
                )}
            >
                Press to return home
            </button>
        </div>
    );
}

export default Reset;
