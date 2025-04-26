export type Questions = {
    questions: [Question]
}

export type Question = {
    question: string;
    options: string[];
    correctAnswerIdx: number;
    video: string;
    start: number;
    pause: number;
    day: number;
    answer: string;
    isClean: boolean;
}