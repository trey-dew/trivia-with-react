export type Questions = {
    questions: [Question]
}

export type Question = {
    question: string;
    options: string[];
    correctAnswerIdx: number;
}