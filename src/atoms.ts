import { atom } from 'jotai';

export const currentQuestionIdxAtom = atom(0);
export const correctAnswersAtom = atom(0);
export const incorrectAnswersAtom = atom(0);
export const difficultyAtom = atom('default');
export const quizStartedAtom = atom(false);
export const homePageVisibleAtom = atom(true);

// Reset helper atom
export const resetQuizAtom = atom(null, (get, set) => {
    set(currentQuestionIdxAtom, 0);
    set(correctAnswersAtom, 0);
    set(incorrectAnswersAtom, 0);
    set(difficultyAtom, 'default');
    set(homePageVisibleAtom, true);
    set(quizStartedAtom, false);
  });
  
