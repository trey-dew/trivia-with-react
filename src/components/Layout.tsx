import { Outlet, useNavigate } from 'react-router-dom';
import { FaBars, FaHome, FaPlay, FaHistory, FaQuestion, FaInfinity, FaBolt, FaEnvelope, FaBroom } from 'react-icons/fa';
import styles from './Layout.module.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { gameModeAtom, homePageVisibleAtom, quizStartedAtom, resultsAtom, resetQuizAtom, userId } from '../atoms';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const navigate = useNavigate();
  
  const [, setDifficulty] = useAtom(gameModeAtom);
  const [, setShowHomePage] = useAtom(homePageVisibleAtom);
  const [, setStartQuiz] = useAtom(quizStartedAtom);
  const [results, setResults] = useAtom(resultsAtom);
  const [, resetQuiz] = useAtom(resetQuizAtom);
  const [userIdValue] = useAtom(userId);

  const checkExistingSubmission = async (gameMode: string) => {
    if (gameMode === 'Archive' || gameMode === 'Endless') return false;

    try {
      const today = new Date().toISOString().split('T')[0];
      const q = query(
        collection(db, 'quizResults'),
        where('dayString', '==', today),
        where('userId', '==', userIdValue),
      );

      const existing = await getDocs(q);
      return !existing.empty;
    } catch (error) {
      console.error('Error checking existing submission:', error);
      return false;
    }
  };

  const handleGameModeChange = async (selectedDifficulty: string) => {
    // If there are active results, show confirmation
    if (results.length > 0) {
      setPendingAction(() => () => startNewGame(selectedDifficulty));
      setShowConfirmation(true);
      return;
    }

    // If no active results, proceed directly
    await startNewGame(selectedDifficulty);
  };

  const startNewGame = async (selectedDifficulty: string) => {
    const hasPlayed = await checkExistingSubmission(selectedDifficulty);
    
    if (hasPlayed) {
      // You might want to show a different message for this case
      alert("You've already played this mode today!");
      return;
    }

    // Reset any existing results
    if (results.length > 0) {
      setResults([]);
      resetQuiz();
    }

    setDifficulty(selectedDifficulty);
    setShowHomePage(false);
    setStartQuiz(true);

    if (selectedDifficulty === 'Daily') {
      navigate('/daily');
    } else if (selectedDifficulty === 'Endless') {
      navigate('/endless');
    } else if (selectedDifficulty === 'Hard') {
      navigate('/hard');
    } else if (selectedDifficulty === 'Clean') {
      navigate('/daily');
    }
  };

  const handleConfirmation = () => {
    if (pendingAction) {
      pendingAction();
    }
    setShowConfirmation(false);
    setPendingAction(null);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingAction(null);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const sidebarItems = [
    { icon: <FaHome />, label: 'Home', onClick: () => navigate('/') },
    { icon: <FaPlay />, label: 'Daily', onClick: () => handleGameModeChange('Daily') },
    { icon: <FaBroom />, label: 'Clean', onClick: () => handleGameModeChange('Clean') },
    { icon: <FaBolt />, label: 'Hard', onClick: () => handleGameModeChange('Hard') },
    { icon: <FaInfinity />, label: 'Endless', onClick: () => navigate('/Endless') },
    { icon: <FaHistory />, label: 'Archive', onClick: () => navigate('/archive') }, 
    { icon: <FaQuestion />, label: 'How to Play', onClick: () => navigate('/howtoplay') },
  ];

  return (
    <div className={styles.appWrapper}>
      {/* Sidebar */}
      <aside className={classNames(styles.sidebar, { [styles.collapsed]: sidebarCollapsed })}>
        <div className={styles.topSection}>
          <button onClick={toggleSidebar} className={styles.toggleButton}>
            <FaBars size={24} />
          </button>

          <div className={styles.menuItems}>
            {sidebarItems.map((item, index) => (
              <div key={index} onClick={item.onClick} className={styles.menuItem}>
                {item.icon}
                {!sidebarCollapsed && <span>{item.label}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div onClick={() => navigate('/contact')} className={styles.menuItem}>
            <FaEnvelope />
            {!sidebarCollapsed && <span>Contact</span>}
          </div>
        </div>
      </aside>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Are you sure?</h2>
            <p>You have an active game in progress. Switching modes will reset your current progress.</p>
            <div className={styles.modalButtons}>
              <button onClick={handleConfirmation} className={styles.confirmButton}>
                Continue
              </button>
              <button onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
