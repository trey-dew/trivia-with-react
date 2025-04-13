import Statbar_module from './statbar.module.scss';
import Question_module from './Question.module.scss';
type Props = {
    currentQuestion: number;
    totalQuestions: number;
    correct: number;
    incorrect: number;
    quizDate?: string;
};

function StatBar(props: Props) {
    return (
        <div className={Statbar_module['stat-container']}>
            <p>
                Questions: {props.currentQuestion}/{props.totalQuestions} &nbsp;
                Correct: {props.correct} &nbsp;
                Incorrect: {props.incorrect} &nbsp;
                {props.quizDate && <>Date: {props.quizDate}</>}
            </p>
        </div>
    );
}

export default StatBar;
