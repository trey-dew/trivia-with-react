import styles from './App.module.scss';
import questions from "./questions.json"
import { Questions } from './types';
import { useState } from "react"
import StatBar from './components/statbar';

function App() {
const allQuestions = questions as Questions

const [currentQuestionIdx, setCurrentQuestion] = useState(0)
const [correctAnswers, setCorrectAnswers] = useState(0)
const [incorrectAnswers, setIncorrectAnswers] = useState(0)

    return <div>
<StatBar 
currentQuestion = {currentQuestionIdx + 1}
totalQuestions = {allQuestions.questions.length}
correct = {correctAnswers}
incorrect = {incorrectAnswers}
 />
    </div>;
}

export default App;
