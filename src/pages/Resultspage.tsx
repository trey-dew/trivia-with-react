import Reset from '../components/Reset'
import { useState, useEffect, useRef } from 'react';
import questions from '../questions.json';
import { Questions } from '../types';
import { useNavigate } from 'react-router-dom';



function Resultspage() {
    const allQuestions = questions as Questions;

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);

    const [waitingToAdvance, setWaitingToAdvance] = useState(false);
    const [playFullVideo, setPlayFullVideo] = useState(false);
    const [hasPaused, setHasPaused] = useState(false);
    const [showHomePage, setShowHomePage] = useState(true);
    const [startQuiz, setStartQuiz] = useState(false);
    const navigate = useNavigate();


    const reset = () => {
        setCurrentQuestionIdx(0);
        setCorrectAnswers(0);
        setIncorrectAnswers(0);
        setWaitingToAdvance(false);
        setPlayFullVideo(false);
        setHasPaused(false);
        setShowHomePage(true);
        setStartQuiz(false);
        navigate('/');
    };

    return (
        <Reset totalQuestions={allQuestions.questions.length}
            correctQuestions={correctAnswers}
            onPress={reset} 
        />
    );
}

export default Resultspage;