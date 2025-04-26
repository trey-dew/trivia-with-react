import { Outlet, useNavigate } from 'react-router-dom';
import { FaBars, FaHome, FaPlay, FaHistory, FaQuestion, FaInfinity, FaBolt, FaEnvelope } from 'react-icons/fa';
import styles from './Layout.module.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { gameModeAtom, homePageVisibleAtom, quizStartedAtom } from '../atoms';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  
  const [, setDifficulty] = useAtom(gameModeAtom);
  const [, setShowHomePage] = useAtom(homePageVisibleAtom);
  const [, setStartQuiz] = useAtom(quizStartedAtom);

  const start = (selectedDifficulty: string) => {
    setDifficulty(selectedDifficulty);
    setShowHomePage(false);
    setStartQuiz(true);

    if (selectedDifficulty === 'Daily') {
      navigate('/daily');
    } else if (selectedDifficulty === 'Endless') {
      navigate('/endless');
    } else if (selectedDifficulty === 'Hard') {
      navigate('/hard');
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const sidebarItems = [
    { icon: <FaHome />, label: 'Home', onClick: () => navigate('/') },
    { icon: <FaPlay />, label: 'Daily', onClick: () => start('Daily') },
    { icon: <FaHistory />, label: 'Archive', onClick: () => navigate('/archive') },
    { icon: <FaQuestion />, label: 'How to Play', onClick: () => navigate('/howtoplay') },
    { icon: <FaInfinity />, label: 'Endless', onClick: () => start('Endless') },
    { icon: <FaBolt />, label: 'Hard', onClick: () => start('Hard') },
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

      {/* Page Content */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
