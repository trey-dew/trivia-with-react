import styles from './HowToPlay.module.scss';

function HowToPlay() {
    return (
        <div className={styles.howToPlayContainer}>
            <h1 className={styles.title}>How To Play</h1>
            
            <div className={styles.section} >
                <h2>Basics</h2>
                 <ul>
                    <li>Watch the popular Vine and complete the punchline of the video.</li>
                    <li>You only get one attempt at the daily quiz, regardless of the game mode.</li>
                    <li>This quiz will only be updated until June 30th</li>
                </ul>
            </div>

            <div className={styles.gameModes}>
                <div className={styles.modeCard}>
                    <h3>Daily Mode</h3>
                    <p>Basic quiz with 5 questions per day</p>
                    <ul>
                        <li>1,000 points per question</li>
                        <li>Multiple choice format</li>
                        <li>No additional scoring buffs or debuffs</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Hard Mode</h3>
                    <p>Timed version with score penalties</p>
                    <ul>
                        <li>Questions are the same as Daily Mode</li>
                        <li>6 second grace period</li>
                        <li>500 bonus points if you answer correctly under 3 seconds</li>
                        <li>Subtract 110 points per second after grace period</li>
                        <li>Minimum score: 100 points if correct</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Endless Mode</h3>
                    <p>Play previous questions until you make a mistake or run out of questions</p>
                    <ul>
                        <li>Previous days' questions</li>
                        <li>Same scoring as Daily Mode</li>
                        <li>Game immediately ends after one wrong answer</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Clean Mode</h3>
                    <p>Family-friendly version of the daily quiz</p>
                    <ul>
                        <li>No foul language</li>
                        <li>Same scoring as Daily Mode</li>
                        <li>Available alongside daily mode with fewer questions</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Archive Mode</h3>
                    <p>Practice with past daily quizzes</p>
                    <ul>
                        <li>Access to all previous questions</li>
                        <li>No stats are saved</li>
                        <li>Perfect for practice and learning</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Scoring System</h3>
                    <p>Based on speed and correctness (Hard Mode only)</p>
                    <ul>
                        <li>6 second grace period</li>
                        <li>-110 points per second after grace period</li>
                        <li>Minimum score: 100 points if correct</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HowToPlay;