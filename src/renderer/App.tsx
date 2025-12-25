import { useState, useEffect } from 'react';
import { EventCategory } from '@types/event';
import './App.css';

function App() {
  const [activeFilter, setActiveFilter] = useState<EventCategory | 'all'>('all');

  return (
    <div className="app-container">
      <div className="header">
        <h1>🎯 My Countdown Widget</h1>
        <button className="add-btn">+ Add Event</button>
      </div>

      <div className="filter-bar">
        <button 
          className={activeFilter === 'all' ? 'active' : ''}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button 
          className={activeFilter === 'personal' ? 'active' : ''}
          onClick={() => setActiveFilter('personal')}
        >
          Personal
        </button>
        <button 
          className={activeFilter === 'business' ? 'active' : ''}
          onClick={() => setActiveFilter('business')}
        >
          Business
        </button>
      </div>

      <div className="event-list">
        <p className="empty-state">No events yet. Click "+ Add Event" to get started!</p>
      </div>
    </div>
  );
}

export default App;