import { atom } from 'jotai';
import {Question} from './types'

export const currentQuestionIdxAtom = atom(0);
export const correctAnswersAtom = atom(0);
export const incorrectAnswersAtom = atom(0);
export const gameModeAtom = atom('default');
export const quizStartedAtom = atom(false);
export const homePageVisibleAtom = atom(true);
export const selectedArchiveDayAtom = atom<number | null>(null);

// Reset helper atom
export const resetQuizAtom = atom(null, (get, set) => {
    set(currentQuestionIdxAtom, 0);
    set(correctAnswersAtom, 0);
    set(incorrectAnswersAtom, 0);
    set(gameModeAtom, 'default');
    set(homePageVisibleAtom, true);
    set(quizStartedAtom, false);
    set(selectedArchiveDayAtom, 0)
  });
  
type QuizResult = {
  question: Question;
  wasCorrect: boolean;
  timeTaken?: number;
};

export const resultsAtom = atom<QuizResult[]>([]);