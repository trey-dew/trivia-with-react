import styles from './App.module.scss';
import questions from './questions.json';
import { Questions } from './types';
import { useState, useEffect, useRef } from 'react';
import StatBar from './components/statbar';
import QuestionComp from './components/Question';
import Reset from './components/Reset';
import Answer_module from './components/Answer.module.scss';
import Classnames from 'classnames';

const videoMap = import.meta.glob('./assets/videos/*.mp4', { eager: true });

function App() {
    const allQuestions = questions as Questions;

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    const [waitingToAdvance, setWaitingToAdvance] = useState(false);
    const [playDisabled, setPlayDisabled] = useState(false);
    const [showReplay, setShowReplay] = useState(false);
    const [playFullVideo, setPlayFullVideo] = useState(false);
    const [hasPaused, setHasPaused] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);

    const isQuizFinished = currentQuestionIdx >= allQuestions.questions.length;

    const currentQuestion = allQuestions.questions[currentQuestionIdx];
    const videoSrc = !isQuizFinished && currentQuestion?.video
        ? (videoMap[`./assets/videos/${currentQuestion.video}`] as any)?.default
        : undefined;

    const onSubmit = (correct: boolean) => {
        if (correct) setCorrectAnswers(correctAnswers + 1);
        else setIncorrectAnswers(incorrectAnswers + 1);
        setPlayFullVideo(true);
        setWaitingToAdvance(true);
    };

    const advance = () => {
        setWaitingToAdvance(false);
        setCurrentQuestionIdx(currentQuestionIdx + 1);
        setPlayFullVideo(false);
        setHasPaused(false);
    };

    const reset = () => {
        setCurrentQuestionIdx(0);
        setCorrectAnswers(0);
        setIncorrectAnswers(0);
        setWaitingToAdvance(false);
        setPlayFullVideo(false);
        setHasPaused(false);
    };

    useEffect(() => {
        if (isQuizFinished || !videoSrc) return;
        const video = videoRef.current;
        if (!video) return;

        video.load();
        video.play();
        setPlayDisabled(false);
        setShowReplay(false);

        const handleTimeUpdate = () => {
            const pauseTime = currentQuestion.pause;
            if (!playFullVideo && video.currentTime >= pauseTime && !hasPaused) {
                video.pause();
                setPlayDisabled(true);
                setShowReplay(true);
                setHasPaused(true);
            }
        };

        const handleVideoEnded = () => {
            setShowReplay(true);
            setPlayDisabled(true);
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleVideoEnded);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleVideoEnded);
        };
    }, [currentQuestionIdx, playFullVideo, isQuizFinished, videoSrc]);

    useEffect(() => {
        if (isQuizFinished || !videoSrc) return;
        const video = videoRef.current;
        if (video) {
            video.currentTime = currentQuestion.start;
            video.play();
        }
    }, [videoSrc, isQuizFinished]);

    useEffect(() => {
        if (isQuizFinished || !videoSrc) return;
        if (playFullVideo && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    }, [playFullVideo, isQuizFinished, videoSrc]);

    const onReplay = () => {
        if (videoRef.current && videoSrc) {
            videoRef.current.currentTime = currentQuestion.start;
            videoRef.current.play();
            setShowReplay(false);
            setPlayDisabled(false);
        }
    };

    if (isQuizFinished) {
        return (
            <Reset
                totalQuestions={allQuestions.questions.length}
                correctQuestions={correctAnswers}
                onPress={reset}
            />
        );
    }

    return (
        <div>
            <StatBar
                currentQuestion={currentQuestionIdx + 1}
                totalQuestions={allQuestions.questions.length}
                correct={correctAnswers}
                incorrect={incorrectAnswers}
            />
            {videoSrc && (
                <QuestionComp
                    question={currentQuestion}
                    videoSrc={videoSrc}
                    videoRef={videoRef}
                    playDisabled={playDisabled}
                    showReplay={showReplay}
                    onReplay={onReplay}
                    onSubmit={onSubmit}
                />
            )}
            {waitingToAdvance && (
                <button
                    onClick={advance}
                    className={Classnames(Answer_module.answer, styles['next-btn'])}
                >
                    Next Question...
                </button>
            )}
        </div>
    );
}

export default App;
