import Home_module from './Home.module.scss';

import { ReactNode } from 'react';

type Props = {
  onPress: (difficulty: string) => void;
  alreadyPlayedMessage?: ReactNode;
};

function Home({ onPress, alreadyPlayedMessage }: Props) {
  return (
    <div className={Home_module.home}>
      <h1 className={Home_module.text}>Vine'L</h1>
      
      <div className={Home_module.inlineButtons}>
        <button
          onClick={() => onPress('Daily')}
          className={Home_module.optionButton}
        >
          Daily
        </button>
        <button
          onClick={() => onPress('Clean')}
          className={Home_module.optionButton}
        >
          Clean Mode
        </button>
        <button
          onClick={() => onPress('Hard')}
          className={Home_module.optionButton}
        >
          Hard
        </button>
      </div>
      <div className={Home_module.inlineButtons}>
        <button
          onClick={() => onPress('Endless')}
          className={Home_module.optionButton}
        >
          Endless Mode
        </button>
        <button
          onClick={() => onPress('Archive')}
          className={Home_module.optionButton}
        >
          Archive
        </button>
      </div>
      {alreadyPlayedMessage}
      </div>
  );
}

export default Home;
