import { Outlet, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import styles from './Layout.module.scss'; // create this or reuse existing
import classNames from 'classnames';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { gameModeAtom,homePageVisibleAtom,quizStartedAtom } from '../atoms';


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
        } else if(selectedDifficulty === 'Hard'){
            navigate('/hard');
        }
    }

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);


    };

    return (
        <div className={styles.appWrapper}>
            {/* Sidebar */}
            <aside className={classNames(styles.sidebar, { [styles.collapsed]: sidebarCollapsed })}>
                <button onClick={toggleSidebar} className={styles.toggleButton}>
                    <FaBars size={24} />
                </button>

                {!sidebarCollapsed && (
                    <>
                        <button onClick={() => navigate('/')}>Home</button>
                        <button onClick={() => start('Daily')}>Daily</button>
                        <button onClick={() => navigate('/results')}>Archive</button>
                        <button onClick={() => navigate('/howtoplay')}>How to Play</button>
                        <button onClick={() => start('Endless')}>Endless</button>
                        <button onClick={() => start('Hard')}>Hard</button>
                        <button onClick={() => navigate('/results')}>Contact</button>
                    </>
                )}
            </aside>

            {/* Page content */}
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};


export default Layout;
