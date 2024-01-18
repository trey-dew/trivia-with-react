import { Question } from "../types"
import Answers from "./Answers";

type Props = {
    question: Question;
    onSubmit: (correct: boolean) => void 
}

function QuestionComp(props: Props) {
return <div>
    <h3>{props.question.question}</h3>  
    <Answers question={props.question} onSubmit={props.onSubmit}/>
</div>
}
export default QuestionComp