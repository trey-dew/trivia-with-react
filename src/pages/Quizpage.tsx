import { useState, useEffect, useRef } from 'react';
import questions from '../questions.json';
import { Questions } from '../types';
import QuestionComp from '../components/Question';
import Reset from '../components/Reset';
import Home from '../components/Home';
import StatBar from '../components/statbar';
import { useNavigate } from 'react-router-dom';
import Classnames from 'classnames';
import styles from '../App.module.scss';
import Answer_module from '../components/Answer.module.scss';



// Preload video files
const videoMap = import.meta.glob('../assets/videos/*.mp4', { eager: true });

function Quizpage() {
    const navigate = useNavigate();
    const allQuestions = questions as Questions;

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    const [difficulty, setDifficulty] = useState('default');

    const [waitingToAdvance, setWaitingToAdvance] = useState(false);
    const [playDisabled, setPlayDisabled] = useState(false);
    const [showReplay, setShowReplay] = useState(false);
    const [playFullVideo, setPlayFullVideo] = useState(false);
    const [hasPaused, setHasPaused] = useState(false);
    const [showHomePage, setShowHomePage] = useState(true);
    const [startQuiz, setStartQuiz] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const isQuizFinished = currentQuestionIdx >= allQuestions.questions.length;
    const currentQuestion = allQuestions.questions[currentQuestionIdx];
    const videoSrc = !isQuizFinished && currentQuestion?.video
        ? (videoMap[`../assets/videos/${currentQuestion.video}`] as any)?.default
        : undefined;

    const onSubmit = (correct: boolean) => {
        if (correct) setCorrectAnswers(prev => prev + 1);
        else setIncorrectAnswers(prev => prev + 1);
        setPlayFullVideo(true);
        setWaitingToAdvance(true);
    };

    const advance = () => {
        setWaitingToAdvance(false);
        setCurrentQuestionIdx(prev => prev + 1);
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
        setShowHomePage(true);
        setStartQuiz(false);
    };

    const start = (selectedDifficulty: string) => {
        setDifficulty(selectedDifficulty);
        setShowHomePage(false);
        setPlayFullVideo(false);
        setStartQuiz(true);
    };

    const onReplay = () => {
        if (videoRef.current && videoSrc) {
            videoRef.current.currentTime = currentQuestion.start;
            videoRef.current.play();
            setShowReplay(false);
            setPlayDisabled(false);
        }
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
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleVideoEnded);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleVideoEnded);
        };
    }, [currentQuestionIdx, playFullVideo, isQuizFinished, videoSrc, startQuiz]);

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

    useEffect(() => {
        if (isQuizFinished) {
            navigate('/results', {
                state: {
                    totalQuestions: allQuestions.questions.length,
                    correctAnswers,
                    incorrectAnswers,
                },
            });
        }
    }, [isQuizFinished]);

    return (
        <div className={styles.appWrapper}>
            <main className={styles.mainContent}> (
                    <>
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
                    </>
                )
            </main>
        </div>
    );
}

export default Quizpage;
