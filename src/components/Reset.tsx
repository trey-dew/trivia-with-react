import Answer_module from './Answer.module.scss';
import Classnames from 'classnames';
import Reset_module from './Reset.module.scss';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase'; // your firebase.ts should export db
import { collection, addDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
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
    const [resultsSent, setResultsSent] = useState(false); 

    const navigate = useNavigate();

    const handleReset = () => {
        setResults([]);
        resetQuiz(); // clear all global state
        navigate('/'); // go home
        setResultsSent(false);
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
        try {
          const finalScore = calculateFinalScore(results);
          const percentage = Math.trunc((correctAnswers / questionIdx) * 100);
          const now = new Date();
    
          const resultsWithValidData = results.map((res) => ({
            ...res,
            timeTaken: res.timeTaken !== undefined ? res.timeTaken : 0, // Replace undefined timeTaken with 0
          }));

          await addDoc(collection(db, 'quizResults'), {
            date: now.toISOString(),
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
        if (!resultsSent) {
          sendResultsToFirestore();
          setResultsSent(true); // Mark as sent
        }
      }, [resultsSent]);

    return (
        <div className={Reset_module['end-screen']}>
            
            <h1 className={Reset_module['reset-text']}>
                You scored: {Math.trunc(correctAnswers / questionIdx * 100)}%
            </h1>
            <h2 className={Reset_module['reset-text']}>
               {calculateFinalScore(results)} / 5000
            </h2>
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
                    }
                    </p>
                    )}
                    {res.timeTaken === undefined && (
                    <p><strong>Score:</strong> {
                        res.wasCorrect
                            ? 1000
                            : 0
                    }
                    </p>
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
