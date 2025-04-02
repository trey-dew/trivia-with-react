import Statbar_module from './statbar.module.scss';
import Question_module from './Question.module.scss';
type Props = {
    currentQuestion: number;
    totalQuestions: number;
    correct: number;
    incorrect: number;
};

function StatBar(props: Props) {
    return (
        <div className={Statbar_module['stat-container']}>
            <p>
                Questions: {
                props.currentQuestion}/{props.totalQuestions} Correct: {props.correct}{' '}
                Incorrect: {props.incorrect}
            </p>
        </div>
    );
}

export default StatBar;
