import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Archive.module.scss';
import { useSetAtom } from 'jotai';
import { gameModeAtom } from '../atoms';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarDay {
  day: number | null;
  date: Date | null;
}

function Archive() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const setGameMode = useSetAtom(gameModeAtom);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const baseDate = new Date(2025, 3, 20); // April 20, 2025
  
    const timeDiff = clickedDate.getTime() - baseDate.getTime();
    const dayOffset = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // convert ms to days
  
    if (dayOffset >= 0) {
      setGameMode('Archive');
      navigate(`/archive/day/${dayOffset}`);
    } else {
      alert("That date is before the start of the quiz archive.");
    }
  };
  

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const calendarDays: CalendarDay[] = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
    if (i < firstDay) return { day: null, date: null };
    const day = i - firstDay + 1;
    return { 
      day, 
      date: new Date(currentYear, currentMonth, day)
    };
  });

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className={styles.calendarContainer}>
      <header className={styles.calendarHeader}>
        <button 
          className={styles.navButton}
          onClick={() => navigateMonth('prev')}
        >
          &lt;
        </button>
        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentYear}</h2>
        <button 
          className={styles.navButton}
          onClick={() => navigateMonth('next')}
        >
          &gt;
        </button>
      </header>
      <div className={styles.calendarGrid}>
        {daysOfWeek.map((day) => (
          <div key={day} className={styles.dayLabel}>{day}</div>
        ))}
        {calendarDays.map(({ day, date }, idx) => (
          <div key={idx} className={styles.dayCell}>
            {day ? (
              <button 
                className={`${styles.dayButton} ${isToday(date) ? styles.today : ''}`}
                onClick={() => handleDayClick(day)}
              >
                {day}
              </button>
            ) : (
              <div className={styles.emptyDay}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Archive;
