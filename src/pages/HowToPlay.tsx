import styles from './HowToPlay.module.scss';

function HowToPlay() {
    return (
        <div className={styles.howToPlayContainer}>
            <h1 className={styles.title}>How to Play</h1>
            
            <div className={styles.section}>
                <h2>Basics</h2>
                <p>Watch the Popular Vine and complete the punchline of the video. </p>
                <p>You only get one attempt at the daily quiz regardless of the Gamemode.</p>
            </div>

            <div className={styles.gameModes}>
                <div className={styles.modeCard}>
                    <h3>Daily Mode</h3>
                    <p>Basic quiz with 5 questions per day</p>
                    <ul>
                        <li>1000 points per question</li>
                        <li>Multiple choice</li>
                        <li>no additional scoring buffs or debuffs</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Hard Mode</h3>
                    <p>Timed version with score penalties</p>
                    <ul>
                        <li>Quesitons are the same for all daily modes</li>
                        <li>6s grace period</li>
                        <li>500 bonus points if answer under 3 seconds</li>
                        <li>substract 110 points per second after grade period</li>
                        <li>Min score: 100 points if correct</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Endless Mode</h3>
                    <p>Play previous questions until you make a mistake or run out of questions</p>
                    <ul>
                        <li>Previous days' questions</li>
                        <li>Same scoring as the basic Daily mode</li>
                        <li>Game immeditalely ends once you get one wrong</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Clean Mode</h3>
                    <p>Family-friendly version</p>
                    <ul>
                        <li>No foul language</li>
                        <li>Daily mode scoring</li>
                        <li>Available alongside daily, with less questions</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Archive Mode</h3>
                    <p>Practice with past daily quizes</p>
                    <ul>
                        <li>All previous questions</li>
                        <li>No stats saved</li>
                        <li>Perfect for practice</li>
                    </ul>
                </div>

                <div className={styles.modeCard}>
                    <h3>Scoring System</h3>
                    <p>Based on speed and correctness, Only applicable to Hard Mode</p>
                    <ul>
                        <li>6s grace period</li>
                        <li>-110 points per second after grace period</li>
                        <li>Min: 100 points if correct</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HowToPlay;