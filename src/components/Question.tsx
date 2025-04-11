import { useRef, useEffect, useState, HtmlHTMLAttributes } from 'react';
import { Question } from '../types';
import Answers from './Answers';
import Question_module from './Question.module.scss';
import { Play, Pause, RotateCcw } from 'lucide-react';
import myVideo from '../assets/videos/road_work_ahead.mp4';

type Props = {
    question: Question;
    videoSrc: string
    videoRef: React.RefObject<HTMLVideoElement>;
    playDisabled: boolean;
    showReplay: boolean;
    onReplay: () => void;
    onSubmit: (correct: boolean) => void;
};

function QuestionComp({question, videoSrc, videoRef, playDisabled,showReplay, onReplay, onSubmit}: Props) {
    return (
        <div className={Question_module.app}>
            <h3 className={Question_module.question}>{question.question}</h3>
            <div className={Question_module.video}>
                <video key={videoSrc} ref={videoRef} width="600" autoPlay>
                    <source src={videoSrc} type="video/mp4"/>
                </video>                    
            </div>
            <div className={Question_module.controlls}>
                    <button  
                      onClick={() => videoRef.current?.play()} 
                      disabled={playDisabled}
                      className={Question_module.vcontrolls}>
                      <Play size={18} style={{ marginRight: '6px' }} />
                    </button>

                    {!playDisabled && <button 
                      onClick={() => videoRef.current?.pause()}
                      className={Question_module.vcontrolls}>
                      <Pause size={18} style={{ marginRight: '6px' }} />
                    </button>}

                    {showReplay && (
                      <button 
                        onClick={() => {
                          onReplay();
                        }}
                        className={Question_module.vcontrolls}>
                        <RotateCcw size={18} style={{ marginRight: '6px' }} />
                      </button>
                  )}
            </div>
            <Answers
                question={question}
                onSubmit={(correct) => {
                    onSubmit(correct); 
                }}
              />
        </div>
    );
}
export default QuestionComp;