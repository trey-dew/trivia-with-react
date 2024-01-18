import Statbar_module from './statbar.module.scss';
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
                Questions: {props.currentQuestion}/{props.totalQuestions}
            </p>
            <p>Correct: {props.correct}</p>
            <p>Incorrect: {props.incorrect}</p>
        </div>
    );
}

export default StatBar;
