import Home from '../components/Home'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Homepage() {
    const [difficulty, setDifficulty] = useState("default");
    const [showHomePage, setShowHomePage] = useState(true);
    const [startQuiz, setStartQuiz] = useState(false);
    const navigate = useNavigate();

    const start = (selectedDifficulty: string) => {
        setDifficulty(selectedDifficulty);
        setShowHomePage(false);
        setStartQuiz(true);
        navigate('/daily');
    };

    return (

        <Home onPress={start}/>


        //Legacy RN logic handled in Home
         //Show home screen if quiz hasn't started
                // <Home
                    //totalQuestions={allQuestions.questions.length}
                    //correctQuestions={correctAnswers}
                   // onPress={start} // Starts the quiz
               // />


               // <button onClick={() => navigate('/')}>Home</button>
    );
}

export default Homepage;