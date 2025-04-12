import { Outlet, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import styles from './Layout.module.scss'; // create this or reuse existing
import classNames from 'classnames';
import { useState } from 'react';

const Layout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();

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
                        <button onClick={() => navigate('/daily')}>Archive</button>
                        <button onClick={() => navigate('/howtoplay')}>How to Play</button>
                        <button onClick={() => navigate('/results')}>Endless</button>
                        <button onClick={() => navigate('/results')}>Hard</button>
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
