import Answer_module from './Answer.module.scss';
import App_module from '../App.module.scss';
import Classnames from 'classnames';
import Reset_module from './Reset.module.scss';
import { useNavigate } from 'react-router-dom';



type Props = {
    totalQuestions: number;
    correctQuestions: number;    
    onPress: () => void;
};

function Reset(props: Props) {
    const navigate = useNavigate();
    return (
        <div className={Reset_module['end-screen']}>
            <h1 className={Reset_module['reset-text']}>
                You scored: {Math.trunc(props.correctQuestions / props.totalQuestions * 100)}%
            </h1>
            <button
            //onClick={() =>{props.onPress("Daily"), navigate('/results')}} 
                onClick={() =>{ navigate('/')}}
                className={Classnames(
                    Answer_module.answer,
                    App_module['next-btn'],
                    Reset_module['reset-btn']
                )}
            >
                Press to return home
            </button>
        </div>
    );
}

export default Reset;
