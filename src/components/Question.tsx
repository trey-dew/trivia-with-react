import { Question } from '../types';
import Answers from './Answers';
import Question_module from './Question.module.scss';
import myVideo from './assets/Videos/Road_work_ahead.mp4';

type Props = {
    question: Question;
    onSubmit: (correct: boolean) => void;
};

function QuestionComp(props: Props) {
    return (
        <div className={Question_module.app}>
            <h3 className={Question_module.question}>{props.question.question}</h3>
            <video width="600" controls>
                 <source src={myVideo} type="video/mp4" />
            </video>
            <Answers question={props.question} onSubmit={props.onSubmit} />
        </div>
    );
}
export default QuestionComp;
