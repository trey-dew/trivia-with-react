import styles from './HowToPlay.module.scss';

function HowToPlay() {
    return (
        <div className={styles.howToPlayContainer}>
            <h1 className={styles.title}>How to Play</h1>
            
            <div className={styles.section}>
                <h2>Basics</h2>
                <p>Watch the Popular Vine and complete the punchline of the video. </p>
            </div>

            <div className={styles.gameModes}>
                <div className={styles.modeCard}>
                    <h3>Daily Mode</h3>
                    <p>Basic quiz with 5 questions per day</p>
                    <ul>
                        <li>1000 points per question</li>
                        <li>Multiple choice</li>
                        <li>One attempt per day</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Hard Mode</h3>
                    <p>Timed version with score penalties</p>
                    <ul>
                        <li>Same questions as Daily</li>
                        <li>6s grace period</li>
                        <li>500 bonus points if under 3 seconds</li>
                        <li>-110 points per second after 6</li>
                        <li>Min score: 100 points if correct</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Endless Mode</h3>
                    <p>Play until you make a mistake</p>
                    <ul>
                        <li>Previous days' questions</li>
                        <li>Daily mode scoring</li>
                        <li>Track high scores</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Clean Mode</h3>
                    <p>Family-friendly version</p>
                    <ul>
                        <li>No foul language</li>
                        <li>Daily mode scoring</li>
                        <li>Available alongside daily</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Archive Mode</h3>
                    <p>Practice with past questions</p>
                    <ul>
                        <li>All previous questions</li>
                        <li>No stats saved</li>
                        <li>Perfect for practice</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Scoring System</h3>
                    <p>Based on speed and correctness</p>
                    <ul>
                        <li>6s grace period</li>
                        <li>-110 points per second</li>
                        <li>Min: 100 points</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HowToPlay;