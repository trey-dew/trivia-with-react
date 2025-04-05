import { useRef, useEffect, useState } from 'react';
import { Question } from '../types';
import Answers from './Answers';
import Question_module from './Question.module.scss';
import { Play, Pause, RotateCcw } from 'lucide-react';
import myVideo from '../assets/videos/road_work_ahead.mp4';


const videoMap = import.meta.glob('../assets/videos/*.mp4', { eager: true });
const videoKey = '../assets/videos/${props.question.video}';
//console.log("All videoMap keys:", Object.keys(videoMap));



type Props = {
    question: Question;
    onSubmit: (correct: boolean) => void;
};

function QuestionComp(props: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playDisabled, setPlayDisabled] = useState(false);
    const [showReplay, setShowReplay] = useState(false);
    const [playFullVideo, setPlayFullVideo] = useState(false);
    
    const videoSrc = (videoMap[`../assets/videos/${props.question.video}`] as any)?.default;
    console.log(videoSrc)


    useEffect(() => {
      if (!videoSrc) {
        console.error(`Video not found: ../assets/videos/${props.question.video}`);
      }
    }, [videoSrc]);
    
    useEffect(() => {
    
      const video = videoRef.current;
      if (!video) return;
    
      const handleTimeUpdate = () => {
        if (!playFullVideo && video.currentTime >= 2.5) {
          video.pause();
          setPlayDisabled(true);
          setShowReplay(true);
        }
      };
    
      video.addEventListener('timeupdate', handleTimeUpdate);
    
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }, [playFullVideo]);

      const handleReplay = () => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0; // Reset to start
          videoRef.current.play();
          setShowReplay(false); // Hide Replay button again
          setPlayDisabled(false)
        }
      };
      
    return (
        <div className={Question_module.app}>
            <h3 className={Question_module.question}>{props.question.question}</h3>
            <div className={Question_module.video} >
                <video ref={videoRef} width="600" autoPlay >
                    <source src={videoSrc} type="video/mp4" />
                </video>                    
            </div>
            <div className={Question_module.controlls}>
                    <button  
                      onClick={() => videoRef.current?.play()} 
                      disabled={playDisabled}
                      className={Question_module.vcontrolls}>
                      <Play size={18} style={{ marginRight: '6px' }} /></button>

                    {!playDisabled && <button 
                      onClick={() => videoRef.current?.pause()}
                      className={Question_module.vcontrolls}>
                      <Pause size={18} style={{ marginRight: '6px' }} />
                    </button>}

                    {showReplay && <button 
                      onClick={handleReplay}
                      className={Question_module.vcontrolls}>
                      <RotateCcw size={18} style={{ marginRight: '6px' }} />
                    </button>}
            </div>
            <Answers
                question={props.question}
                onSubmit={(correct) => {
                props.onSubmit(correct); // ✅ still sends result up
                setPlayFullVideo(true);  // ✅ tells video to play full
                if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play(); // ✅ starts full video
                }
               }}
              />
        </div>
    );
}
export default QuestionComp;
