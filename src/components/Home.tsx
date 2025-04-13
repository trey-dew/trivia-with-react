import Home_module from './Home.module.scss';

type Props = {
  onPress: (difficulty: string) => void;
};

function Home({ onPress }: Props) {
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
          onClick={() => onPress('Iconic')}
          className={Home_module.optionButton}
        >
          Iconic
        </button>
        <button
          onClick={() => onPress('Hard')}
          className={Home_module.optionButton}
        >
          Hard
        </button>
      </div>

      <button
        onClick={() => onPress('Endless')}
        className={Home_module.startButton}
      >
        Endless Mode
      </button>
    </div>
  );
}

export default Home;
