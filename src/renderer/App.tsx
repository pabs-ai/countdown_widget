import { useState, useEffect } from 'react';
import { EventCategory, Event } from '@types/event';
import { useEventStore } from '@store/eventStore';
import AddEventModal from '@components/AddEventModal';
import EditEventModal from '@components/EditEventModal';
import SettingsPanel from '@components/SettingsPanel';
import EventCard from '@components/EventCard';
import { useNotifications } from '@hooks/useNotifications';
import './App.css';

function App() {
  const [activeFilter, setActiveFilter] = useState<EventCategory | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { events, loadEvents } = useEventStore();
  
  useNotifications();

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const filteredEvents = events.filter((event) => {
    if (activeFilter === 'all') return true;
    return event.category === activeFilter;
  });

  return (
    <div className="app-container">
      <div className="header">
        <h1>🎯 My Countdown Widget</h1>
        <div className="header-actions">
          <button 
            className="theme-toggle" 
            onClick={() => setIsSettingsPanelOpen(true)}
            title="Settings"
          >
            ⚙️
          </button>
          <button 
            className="theme-toggle" 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
            + Add Event
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <button 
          className={activeFilter === 'all' ? 'active' : ''}
          onClick={() => setActiveFilter('all')}
        >
          All ({events.length})
        </button>
        <button 
          className={activeFilter === 'personal' ? 'active' : ''}
          onClick={() => setActiveFilter('personal')}
        >
          Personal ({events.filter(e => e.category === 'personal').length})
        </button>
        <button 
          className={activeFilter === 'business' ? 'active' : ''}
          onClick={() => setActiveFilter('business')}
        >
          Business ({events.filter(e => e.category === 'business').length})
        </button>
      </div>

      <div className="event-list">
        {filteredEvents.length === 0 ? (
          <p className="empty-state">
            No events yet. Click "+ Add Event" to get started!
          </p>
        ) : (
          <div className="events">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onEdit={setEditingEvent}
              />
            ))}
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <AddEventModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {editingEvent && (
        <EditEventModal 
          event={editingEvent} 
          onClose={() => setEditingEvent(null)} 
        />
      )}

      {isSettingsPanelOpen && (
        <SettingsPanel onClose={() => setIsSettingsPanelOpen(false)} />
      )}
    </div>
  );
}

export default App;