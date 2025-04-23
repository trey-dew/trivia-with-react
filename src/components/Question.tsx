import { useRef, useEffect, useState, HtmlHTMLAttributes } from 'react';
import { Question } from '../types';
import Answers from './Answers';
import Question_module from './Question.module.scss';
import { Play, Pause, RotateCcw } from 'lucide-react';
import AnswerList from '../Answers.json'
import myVideo from '../assets/videos/road_work_ahead.mp4';
import { useAtom } from 'jotai';
import { resultsAtom } from '../atoms';

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
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<number | null>(null);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [results, setResults] = useAtom(resultsAtom);


  useEffect(() => {
    setStartTime(Date.now());
    setInput('');
    setSuggestions([]);
    setElapsedTime(0);
    setSubmitted(false)
    setIsCorrect(null)
    setButtonPressed(false);

    if (timerRef.current) clearInterval(timerRef.current); // clear any existing timer

      timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 0.1);
    }, 100);
  
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question]);

  const handleHardSubmit = () => {
    const normalizedInput = input.trim().toLowerCase();
    const isCorrect = question.answer.toLowerCase() === normalizedInput;
    const timeTaken = (Date.now() - startTime) / 1000;

    setResults((prev) => [
      ...prev,
      {
        question,
        wasCorrect: isCorrect,
        timeTaken,
      },
    ]);

    setIsCorrect(isCorrect);
    setSubmitted(true);
    if(timerRef.current) clearInterval(timerRef.current);
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
           <div className={Question_module.timeTaken}>
              Time: {elapsedTime.toFixed(1)} seconds
            </div>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
                    handleSuggestionClick(suggestions[highlightedIndex]);
                  } else if (!submitted) {
                    handleHardSubmit();
                    setButtonPressed(true);
                  }
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setHighlightedIndex((prev) =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                  );
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setHighlightedIndex((prev) =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                  );
                }
              }}
              placeholder="Type your answer..."
              className={`${Question_module.hardInput} ${
                submitted ? (isCorrect ? Question_module.correct : Question_module.incorrect) : ''
              }`}
            />

          {suggestions.length > 0 && (
            <div className={`${Question_module.suggestionList} ${Question_module.suggestionVisible}`}>
             {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={`${Question_module.suggestionButton} ${
                  index === highlightedIndex ? Question_module.highlighted : ''
                }`}
              >
                {suggestion}
              </button>
            ))}

          </div>
          )}
          {!buttonPressed && (
            <button
              onClick= {() =>{
                handleHardSubmit();
                setButtonPressed(true);
              }}
              className={Question_module.submitButton}
            >
              Submit
            </button>
          )}
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