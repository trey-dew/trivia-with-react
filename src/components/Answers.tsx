import { useState, useEffect } from 'react';
import { Question } from '../types';
import Answer from './Answer';
import Answers_module from './Answers.module.scss';

type Props = {
    question: Question;
    onSubmit: (correct: boolean, question: Question) => void;
  };
  

function Answers(props: Props) {
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        setShowAnswer(false);
    }, [props.question]);

    const onPress = (idx: number) => {
        setShowAnswer(true);
        const isCorrect = props.question.correctAnswerIdx === idx;
        props.onSubmit(isCorrect, props.question);

    };

    return (
        <div className={Answers_module.options}>
            {props.question.options.map((Option, idx) => {
                let color = '';

                if (showAnswer && props.question.correctAnswerIdx === idx) color = 'green';
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
