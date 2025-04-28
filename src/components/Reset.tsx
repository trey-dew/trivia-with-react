import Answer_module from './Answer.module.scss';
import Classnames from 'classnames';
import Reset_module from './Reset.module.scss';
import { useNavigate } from 'react-router-dom';
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
} from '../atoms';

function Reset() {
    const [results, setResults] = useAtom(resultsAtom)
    const [correctAnswers] = useAtom(correctAnswersAtom);
    const [questionIdx] = useAtom(currentQuestionIdxAtom);
    const [, resetQuiz] = useAtom(resetQuizAtom);
    const resultsSentRef = useRef(false);  
    const [averageCorrectAnswers, setAverageCorrectAnswers] = useState<number | null>(null);
    const [averagePercentage, setAveragePercentage] = useState<number | null>(null);


    const navigate = useNavigate();

    useEffect(() => {
      // Define an async function to fetch today's quiz results and calculate averages
      const fetchAverageStats = async () => {
          try {
              // Step 1: Get today's date string in "YYYY-MM-DD" format
              const todayString = new Date().toISOString().split('T')[0];
  
              // Step 2: Create a query to Firestore to get all quizResults where 'dayString' == today
              const q = query(
                  collection(db, 'quizResults'),        // Target the 'quizResults' collection
                  where('dayString', '==', todayString)  // Only entries from today
              );
  
              // Step 3: Run the query
              const querySnapshot = await getDocs(q);
  
              // Step 4: Initialize counters
              let totalCorrect = 0;   // Total number of correct answers across all users today
              let totalPercentage = 0; // Total percentage across all users today
              let count = 0;          // How many quiz submissions there are
  
              // Step 5: Loop through each document returned
              querySnapshot.forEach((doc) => {
                  const data = doc.data();
  
                  // Only include entries that have the expected fields
                  if (typeof data.correctAnswers === 'number' && typeof data.percentage === 'number') {
                      totalCorrect += data.correctAnswers;
                      totalPercentage += data.percentage;
                      count += 1;
                  }
              });
  
              // Step 6: Calculate the averages and update local state
              if (count > 0) {
                  setAverageCorrectAnswers(totalCorrect / count);  // Average correct answers
                  setAveragePercentage(totalPercentage / count);   // Average percentage correct
              } else {
                  setAverageCorrectAnswers(null);  // No data for today
                  setAveragePercentage(null);
              }
          } catch (error) {
              // If something goes wrong, log the error for debugging
              console.error('Error fetching average stats:', error);
          }
      };
  
      // Step 7: Immediately call the function when component mounts
      fetchAverageStats();
  }, []);
  

    const handleReset = () => {
        setResults([]);
        resetQuiz(); // clear all global state
        navigate('/'); // go home
        resultsSentRef.current = false;  // Reset the reference on reset
    };

    const calculateFinalScore = (results: any[]) => {
        return results.reduce((total, res) => {
        if (res.wasCorrect ) {
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
    };
    
    const sendResultsToFirestore = async () => {

        if (results.length === 0) {
          console.log('No results to send.');
          return;  // Avoid sending empty results
        }
        try {
            const finalScore = calculateFinalScore(results);
            const percentage = Math.trunc((correctAnswers / questionIdx) * 100);
            const now = new Date();
            const dayString = now.toISOString().split('T')[0]; // Get YYYY-MM-DD

            const resultsWithValidData = results.map((res) => ({
                ...res,
                timeTaken: res.timeTaken !== undefined ? res.timeTaken : 0, // Replace undefined timeTaken with 0
            }));

            await addDoc(collection(db, 'quizResults'), {
                date: now.toISOString(),
                dayString,
                correctAnswers,
                incorrectAnswers: questionIdx - correctAnswers,
                totalQuestions: questionIdx,
                finalScore,
                percentage,
                results: resultsWithValidData,
            });

            console.log('Results saved to Firestore');
        } catch (error) {
            console.error('Error saving results:', error);
        }
    };

    useEffect(() => {
        // Only call sendResultsToFirestore if results haven't been sent already
        if (!resultsSentRef.current) {
            resultsSentRef.current = true; // Mark as sent
            sendResultsToFirestore();
        }
    }, [results]);  // Dependency array to ensure it only runs when results change

    return (
        <div className={Reset_module['end-screen']}>
            {averageCorrectAnswers !== null && averagePercentage !== null ? (
              <div>
                <h1 className={Reset_module['reset-text']}>
                    You scored: {Math.trunc(correctAnswers / questionIdx * 100)}% The average was: {Math.trunc(averagePercentage)}%
                </h1>
                <h2 className={Reset_module['reset-text']}>
                  {calculateFinalScore(results)} / 5000 Average was: {averageCorrectAnswers * 1000}
                </h2>
              </div>
              ) : (
                <h2>
                  No data </h2>
            )}
            <h2>Results...</h2>
            {results.map((res,idx) => (
                <div key={idx}>
                    <p><strong>Q:</strong> {res.question.question}</p>
                    <p>{res.wasCorrect ? '✅ Correct' : '❌ Incorrect'}</p>
                    {res.timeTaken !== undefined && (
                    <p><strong>Time Taken:</strong> {res.timeTaken.toFixed(1)}s</p>
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
