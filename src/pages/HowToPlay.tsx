import styles from './HowToPlay.module.scss';

function HowToPlay() {
    return (
        <div className={styles.howToPlayContainer}>
            <h1 className={styles.title}>How to Play</h1>
            
            <div className={styles.section}>
                <h2>Basic Rules</h2>
                <p>Watch the video clip and select the correct answer from the options provided. Your score is based on both accuracy and speed!</p>
            </div>

            <div className={styles.gameModes}>
                <div className={styles.modeCard}>
                    <h3>Daily Mode</h3>
                    <p>Play one new question each day. Questions are synchronized to Central Time Zone, with Day 0 starting on May 8th, 2025.</p>
                    <ul>
                        <li>Score up to 1000 points per question</li>
                        <li>Points decrease based on time taken</li>
                        <li>Perfect score: 1000 points</li>
                        <li>Minimum score: 100 points</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Hard Mode</h3>
                    <p>Challenge yourself with the daily question, but with a stricter scoring system.</p>
                    <ul>
                        <li>Same question as Daily mode</li>
                        <li>More aggressive time penalty</li>
                        <li>Perfect score: 1000 points</li>
                        <li>Minimum score: 100 points</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Endless Mode</h3>
                    <p>Keep playing until you get a question wrong. Questions are from all previous days.</p>
                    <ul>
                        <li>Play until you make a mistake</li>
                        <li>Questions from past days only</li>
                        <li>Same scoring system as Daily mode</li>
                        <li>Try to beat your high score!</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Clean Mode</h3>
                    <p>Family-friendly version of the daily question, with content suitable for all ages.</p>
                    <ul>
                        <li>Same scoring as Daily mode</li>
                        <li>Curated clean content</li>
                        <li>Perfect for family play</li>
                        <li>Available daily</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Archive Mode</h3>
                    <p>Replay questions from any past day.</p>
                    <ul>
                        <li>Access to all previous questions</li>
                        <li>Practice mode - no score tracking</li>
                    </ul>
                </div>
            </div>

            <div className={styles.scoringSection}>
                <h2>Scoring System</h2>
                <div className={styles.scoringDetails}>
                    <p>Your score is calculated based on two factors:</p>
                    <ul>
                        <li><strong>Correctness:</strong> You must select the correct answer to earn points</li>
                        <li><strong>Speed:</strong> Points decrease based on how long you take to answer</li>
                    </ul>
                    <p className={styles.scoringFormula}>
                        Score = 1000 - (time taken - 6 seconds) × 110
                    </p>
                    <p className={styles.scoringNote}>
                        Note: Minimum score is 100 points, and you have a 6-second grace period before time penalties begin.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HowToPlay;