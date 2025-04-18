import { useRef, useEffect, useState, HtmlHTMLAttributes } from 'react';
import { Question } from '../types';
import Answers from './Answers';
import Question_module from './Question.module.scss';
import { Play, Pause, RotateCcw } from 'lucide-react';
import AnswerList from '../Answers.json'
import myVideo from '../assets/videos/road_work_ahead.mp4';

type Props = {
    question: Question;
    videoSrc: string
    videoRef: React.RefObject<HTMLVideoElement>;
    playDisabled: boolean;
    showReplay: boolean;
    onReplay: () => void;
    onSubmit: (correct: boolean, timeTaken?: number) => void;
    gameMode: string;
    correctAnsers: string[]
};

function QuestionComp({question, videoSrc, videoRef, playDisabled,showReplay, onReplay, onSubmit, gameMode,}: Props) {
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setStartTime(Date.now());
    setInput('');
    setSuggestions([]);
  }, [question]);

  const handleHardSubmit = () => {
    const normalizedInput = input.trim().toLowerCase();
    const isCorrect = question.options.some(
      (answer) => answer.toLowerCase() === normalizedInput
    );
    const timeTaken = (Date.now() - startTime) / 1000;
    onSubmit(isCorrect, timeTaken);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 0) {
      const matches = (AnswerList.answers as string[]).filter((a) =>
        a.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
  };

  return (
    <div className={Question_module.app}>
      <h3 className={Question_module.question}>{question.question}</h3>

      <div className={Question_module.video}>
        <video key={videoSrc} ref={videoRef} width="600" autoPlay>
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>

      <div className={Question_module.controlls}>
        <button
          onClick={() => videoRef.current?.play()}
          disabled={playDisabled}
          className={Question_module.vcontrolls}
        >
          <Play size={18} style={{ marginRight: '6px' }} />
        </button>

        {!playDisabled && (
          <button
            onClick={() => videoRef.current?.pause()}
            className={Question_module.vcontrolls}
          >
            <Pause size={18} style={{ marginRight: '6px' }} />
          </button>
        )}

        {showReplay && (
          <button
            onClick={onReplay}
            className={Question_module.vcontrolls}
          >
            <RotateCcw size={18} style={{ marginRight: '6px' }} />
          </button>
        )}
      </div>

      {gameMode === 'Hard' ? (
        <div className={Question_module.hardInputWrapper}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your answer..."
            className={Question_module.hardInput}
          />
          {suggestions.length > 0 && (
            <ul className={Question_module.suggestionList}>
              {
                suggestions.map((suggestion, index)=> (
                  <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={Question_module.suggestionItem}
                  >
                    {suggestion}
                  </li>
                ))
              }
            </ul>
          )}
          <button
            onClick={handleHardSubmit}
            className={Question_module.submitButton}
          >
            Submit
          </button>
        </div>
      ) : (
        <Answers
          question={question}
          onSubmit={(correct) => {
            onSubmit(correct);
          }}
        />
      )}
    </div>
  );
}

export default QuestionComp;