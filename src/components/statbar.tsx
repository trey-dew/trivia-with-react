import Statbar_module from './statbar.module.scss';
import Question_module from './Question.module.scss';

type Props = {
    currentQuestion: number;
    totalQuestions: number;
    correct: number;
    incorrect: number;
    quizDate?: string;
    autoReplay: boolean;
    onAutoReplayChange: (value: boolean) => void;
};

function StatBar(props: Props) {
    return (
        <div className={Statbar_module['stat-container']}>
            <div className={Statbar_module['stats-row']}>
                <p>
                    Questions: {props.currentQuestion}/{props.totalQuestions} &nbsp;
                    Correct: {props.correct} &nbsp;
                    Incorrect: {props.incorrect} &nbsp;
                    {props.quizDate && <>Date: {props.quizDate}</>}
                </p>
                <div className={Statbar_module['replay-toggle']}>
                    <label className={Statbar_module['switch']}>
                        <input
                            type="checkbox"
                            checked={props.autoReplay}
                            onChange={(e) => props.onAutoReplayChange(e.target.checked)}
                        />
                        <span className={Statbar_module['slider']}></span>
                    </label>
                    <span className={Statbar_module['toggle-label']}>
                        {props.autoReplay ? 'Replay' : 'Resume Play'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default StatBar;
