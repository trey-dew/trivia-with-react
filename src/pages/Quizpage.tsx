import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import questions from '../questions.json';
import { Questions } from '../types';

import QuestionComp from '../components/Question';
import StatBar from '../components/statbar';

import {
  currentQuestionIdxAtom,
  correctAnswersAtom,
  incorrectAnswersAtom,
  gameModeAtom,
  quizStartedAtom,
  homePageVisibleAtom,
} from '../atoms';

import styles from '../App.module.scss';
import Answer_module from '../components/Answer.module.scss';
import question_module from '../components/Question.module.scss';
import Classnames from 'classnames';

// Eagerly preload all videos so they're ready when needed
const videoMap = import.meta.glob('../assets/videos/*.mp4', { eager: true });

// gets and sets the date based off the question day value
function getDateFromDayOffset(offset: number): string {
  const baseDate = new Date(2025, 3, 12); // Months are 0-indexed (3 = April) CHANGE THIS IF WANT NEW START DATE
  baseDate.setDate(baseDate.getDate() + offset);
  return baseDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}


function Quizpage() {
  const navigate = useNavigate();

  // Global state (Jotai atoms)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useAtom(currentQuestionIdxAtom);
  const [correctAnswers, setCorrectAnswers] = useAtom(correctAnswersAtom);
  const [incorrectAnswers, setIncorrectAnswers] = useAtom(incorrectAnswersAtom);
  const [gameMode] = useAtom(gameModeAtom);
  const [startQuiz] = useAtom(quizStartedAtom);
  const [showHomePage] = useAtom(homePageVisibleAtom);

  // Local state (specific to this component's lifecycle)
  const [waitingToAdvance, setWaitingToAdvance] = useState(false);
  const [playDisabled, setPlayDisabled] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const [playFullVideo, setPlayFullVideo] = useState(false);
  const [hasPaused, setHasPaused] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

   // Calculate based on the day based in for daily
 const getFilteredQuestions = () => {
  if (gameMode === 'Daily') {
    return (questions as Questions).questions.filter(q => q.day === 1); // CHANGE THIS IF WANT TO TEST DIFFERNT DAY
  } else if (gameMode === 'Endless') {
    return (questions as Questions).questions; // all of them
  }
  // Add more modes here
  return [];
};

const filteredQuestions = getFilteredQuestions();

  // Derived values
  const isQuizFinished = currentQuestionIdx >= filteredQuestions.length;
  const currentQuestion = filteredQuestions[currentQuestionIdx];

  // gets the quizdate from quesitons day
  const quizDate = gameMode !== 'Endless'
    ? getDateFromDayOffset(currentQuestion?.day || 0)
    : undefined;


  const videoSrc = !isQuizFinished && currentQuestion?.video
    ? (videoMap[`../assets/videos/${currentQuestion.video}`] as any)?.default
    : undefined;

  // When an answer is submitted, mark correct/incorrect, and prep to play full video
  const onSubmit = (correct: boolean) => {
    correct ? setCorrectAnswers(prev => prev + 1) : setIncorrectAnswers(prev => prev + 1);
    setPlayFullVideo(true);
    setWaitingToAdvance(true);
  };

  // Advance to next question
  const advance = () => {
    setWaitingToAdvance(false);
    setCurrentQuestionIdx(prev => prev + 1);
    setPlayFullVideo(false);
    setHasPaused(false);
  };

  // Replay from start time
  const onReplay = () => {
    if (videoRef.current && videoSrc) {
      videoRef.current.currentTime = currentQuestion.start;
      videoRef.current.play();
      setShowReplay(false);
      setPlayDisabled(false);
    }
  };

  // Set up video time-based logic (pausing at set time unless watching full video)
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
  }, [currentQuestionIdx, playFullVideo, isQuizFinished, videoSrc]);

  // Jump to current question's start time whenever video changes
  useEffect(() => {
    if (isQuizFinished || !videoSrc) return;
    const video = videoRef.current;
    if (video) {
      video.currentTime = currentQuestion.start;
      video.play();
    }
  }, [videoSrc]);

  // If full video playback is enabled, restart from the beginning
  useEffect(() => {
    if (isQuizFinished || !videoSrc) return;
    if (playFullVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, [playFullVideo]);

  // Redirect to results screen when quiz ends
  useEffect(() => {
    if (isQuizFinished) {
      navigate('/results', {
        state: {
          totalQuestions: filteredQuestions.length,
          correctAnswers,
          incorrectAnswers,
        },
      });
    }
  }, [isQuizFinished]);

  return (
    <div className={styles.appWrapper}>
      <main className={styles.mainContent}>
        <>
          <StatBar
            currentQuestion={currentQuestionIdx + 1}
            totalQuestions={filteredQuestions.length}
            correct={correctAnswers}
            incorrect={incorrectAnswers}
            quizDate={quizDate}
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
              className={Classnames(Answer_module.answer, question_module['next-btn'])}
            >
              Next Question...
            </button>
          )}
        </>
      </main>
    </div>
  );
}

export default Quizpage;
