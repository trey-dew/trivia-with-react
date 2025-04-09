import Classnames from 'classnames';
import Home_module from './Home.module.scss';

type Props = {
    totalQuestions: number;
    correctQuestions: number;    
    onPress: (difficulty: string) => void;
};

function Home(props: Props) {
    return (
        <div className={Home_module.home}>
            <h1 className={Home_module.text}>
               Vine'L
            </h1>

            <div className={Home_module.inlineButtons}>
                <button
                    onClick={() =>{props.onPress("Daily")}} 
                    className={Home_module.optionButton}>
                    Daily
                </button>
                <button 
                    onClick={() =>{props.onPress("Iconic")}}
                    className={Home_module.optionButton}>
                    Iconic
                </button>
                <button 
                    onClick={() =>{props.onPress("Hard")}}
                    className={Home_module.optionButton}>
                    Hard
                </button>
            </div>

            <button
                 onClick={() =>{props.onPress("Default")}}
                className={Home_module.startButton}
            >
                Start Quiz
            </button>
        </div>
    );
}

export default Home;
