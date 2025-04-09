import styles from './App.module.scss';
import questions from './questions.json';
import { Questions } from './types';
import { useState, useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import StatBar from './components/statbar';
import QuestionComp from './components/Question';
import Reset from './components/Reset';
import Home from './components/Home';
import Answer_module from './components/Answer.module.scss';
import Classnames from 'classnames';

// Preload all video files in the assets folder
const videoMap = import.meta.glob('./assets/videos/*.mp4', { eager: true });

function App() {
    const allQuestions = questions as Questions;

    // Quiz state tracking
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    const [difficulty, setDifficulty] = useState("default");

    // UI state
    const [waitingToAdvance, setWaitingToAdvance] = useState(false);
    const [playDisabled, setPlayDisabled] = useState(false);
    const [showReplay, setShowReplay] = useState(false);
    const [playFullVideo, setPlayFullVideo] = useState(false);
    const [hasPaused, setHasPaused] = useState(false);
    const [showHomePage, setShowHomePage] = useState(true);
    const [startQuiz, setStartQuiz] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Ref to access the video DOM element
    const videoRef = useRef<HTMLVideoElement>(null);

    // Check if quiz is complete
    const isQuizFinished = currentQuestionIdx >= allQuestions.questions.length;

    // Get current question and its associated video
    const currentQuestion = allQuestions.questions[currentQuestionIdx];
    const videoSrc = !isQuizFinished && currentQuestion?.video
        ? (videoMap[`./assets/videos/${currentQuestion.video}`] as any)?.default
        : undefined;

    // toggles the sidebar
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    // Called when the user submits an answer
    const onSubmit = (correct: boolean) => {
        if (correct) setCorrectAnswers(correctAnswers + 1);
        else setIncorrectAnswers(incorrectAnswers + 1);
        setPlayFullVideo(true);
        setWaitingToAdvance(true);
    };

    // Proceed to next question
    const advance = () => {
        setWaitingToAdvance(false);
        setCurrentQuestionIdx(currentQuestionIdx + 1);
        setPlayFullVideo(false);
        setHasPaused(false);
    };

    // Reset the entire quiz
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
    // shows home page WIP
    const home = () => {
        setShowHomePage(true);
        setStartQuiz(false);
    };

    // Handles play/pause logic based on quiz flow
    useEffect(() => {
        if (isQuizFinished || !videoSrc) return;
        const video = videoRef.current;
        if (!video) return;

        video.load();
        video.play();
        setPlayDisabled(false);
        setShowReplay(false);

         // Pause the video at a specific time unless playing full video
        const handleTimeUpdate = () => {
            const pauseTime = currentQuestion.pause;
            if (!playFullVideo && video.currentTime >= pauseTime && !hasPaused) {
                video.pause();
                setPlayDisabled(true);
                setShowReplay(true);
                setHasPaused(true);
            }
        };

         // Show replay option when video ends
        const handleVideoEnded = () => {
            setShowReplay(true);
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleVideoEnded);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleVideoEnded);
        };
    }, [currentQuestionIdx, playFullVideo, isQuizFinished, videoSrc]);

    // Seek to the start time of the video on load
    useEffect(() => {
        if (isQuizFinished || !videoSrc) return;
        const video = videoRef.current;
        if (video) {
            video.currentTime = currentQuestion.start;
            video.play();
        }
    }, [videoSrc, isQuizFinished]);

    // Replay video from the beginning when playFullVideo is triggered
    useEffect(() => {
        if (isQuizFinished || !videoSrc) return;
        if (playFullVideo && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    }, [playFullVideo, isQuizFinished, videoSrc]);

    // Handler for manual replay button
    const onReplay = () => {
        if (videoRef.current && videoSrc) {
            videoRef.current.currentTime = currentQuestion.start;
            videoRef.current.play();
            setShowReplay(false);
            setPlayDisabled(false);
        }
    };

    // sets the difficulty for the quiz
    const start = (selectedDifficulty: string) => {
        setDifficulty(selectedDifficulty);
        setShowHomePage(false);
        setStartQuiz(true);
    };


// Defines the overall layout for the app
const layout = (
    <div className={styles.appWrapper}> {/* Flex container for sidebar and main content */}

        {/* Sidebar section */}
        <aside className={Classnames(styles.sidebar, { [styles.collapsed]: sidebarCollapsed })}>
            
            <button onClick={toggleSidebar} className={styles.toggleButton}>
                <FaBars size={24} />
            </button>

            {/* Sidebar buttons (hidden when collapsed) */}
            {!sidebarCollapsed && (
                <>
                    <button>Button 1</button>
                    <button>Button 2</button>
                    <button>Button 3</button>
                    <button>Button 4</button>
                    <button>Button 5</button>
                </>
            )}
        </aside>

        {/* Main content area */}
        <main className={styles.mainContent}>
            {/* Show results screen if quiz is finished */}
            {isQuizFinished ? (
                <Reset
                    totalQuestions={allQuestions.questions.length}
                    correctQuestions={correctAnswers}
                    onPress={reset} // Resets the quiz
                />
            ) : showHomePage ? (
                // Show home screen if quiz hasn't started
                <Home
                    totalQuestions={allQuestions.questions.length}
                    correctQuestions={correctAnswers}
                    onPress={start} // Starts the quiz
                />
            ) : (
                <>
                    {/* Progress/status bar */}
                    <StatBar
                        currentQuestion={currentQuestionIdx + 1}
                        totalQuestions={allQuestions.questions.length}
                        correct={correctAnswers}
                        incorrect={incorrectAnswers}
                    />

                    {/* Video question component */}
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

                    {/* Show "Next Question" button after answering */}
                    {waitingToAdvance && (
                        <button
                            onClick={advance}
                            className={Classnames(Answer_module.answer, styles['next-btn'])}
                        >
                            Next Question...
                        </button>
                    )}
                </>
            )}
        </main>
    </div>
);

// Return the entire layout to be rendered
return layout;

}

export default App;
