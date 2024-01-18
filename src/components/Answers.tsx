import { useState} from "react"
import { Question } from "../types";
import Answer from "./Answer";

type Props = {
    question: Question;
    onSubmit: (correct: boolean) => void;
}

function Answers(props: Props) {
    const [showAnswer, setShowAnswer] = useState(false);

    const onPress = (idx: number) => {
        setShowAnswer(true);
        props.onSubmit(props.question.correctAnswerIdx === idx);
    }

    return (
    <div>
        {props.question.options.map((Option, idx) => {
            let color = '';

            if(showAnswer && props.question.correctAnswerIdx === idx) color = 'green';
            else if (showAnswer) color = 'red';

            return (
                <Answer
                    text={Option} 
                    onPress={() => onPress(idx)} 
                    color={color} 
                    disabled={showAnswer}
                    key={idx}
                />
            );
        })}
    </div>
    );
}

export default Answers;