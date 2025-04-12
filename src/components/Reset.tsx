import Answer_module from './Answer.module.scss';
import App_module from '../App.module.scss';
import Classnames from 'classnames';
import Reset_module from './Reset.module.scss';
import { useNavigate } from 'react-router-dom';

import { useAtom } from 'jotai';
import {
  correctAnswersAtom,
  incorrectAnswersAtom,
  currentQuestionIdxAtom,
  resetQuizAtom,
} from '../atoms';



function Reset() {

    const [correctAnswers] = useAtom(correctAnswersAtom);
    const [questionIdx] = useAtom(currentQuestionIdxAtom);
    const [, resetQuiz] = useAtom(resetQuizAtom);

    const navigate = useNavigate();

    const handleReset = () => {
        resetQuiz(); // clear all global state
        navigate('/'); // go home
      };
    return (
        <div className={Reset_module['end-screen']}>
            <h1 className={Reset_module['reset-text']}>
                You scored: {Math.trunc(correctAnswers / questionIdx * 100)}%
            </h1>
            <button
            //onClick={() =>{props.onPress("Daily"), navigate('/results')}} 
                onClick={handleReset}
                className={Classnames(
                    Answer_module.answer,
                    App_module['next-btn'],
                    Reset_module['reset-btn']
                )}
            >
                Press to return home
            </button>
        </div>
    );
}

export default Reset;
