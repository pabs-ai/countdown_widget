import { useState } from 'react';
import { useSettingsStore } from '@store/settingsStore';
import { useEventStore } from '@store/eventStore';
import './SettingsPanel.css';

interface SettingsPanelProps {
  onClose: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { 
    notificationIntervals, 
    alwaysOnTop, 
    windowSize,
    setNotificationIntervals,
    toggleAlwaysOnTop,
    setWindowSize 
  } = useSettingsStore();
  
  const { events } = useEventStore();
  const [selectedIntervals, setSelectedIntervals] = useState(notificationIntervals);

  const intervalOptions = [
    { value: 10080, label: '1 week before', minutes: 10080 },
    { value: 4320, label: '3 days before', minutes: 4320 },
    { value: 1440, label: '1 day before', minutes: 1440 },
    { value: 720, label: '12 hours before', minutes: 720 },
    { value: 360, label: '6 hours before', minutes: 360 },
    { value: 60, label: '1 hour before', minutes: 60 },
    { value: 30, label: '30 minutes before', minutes: 30 },
  ];

  const handleIntervalToggle = (minutes: number) => {
    const newIntervals = selectedIntervals.includes(minutes)
      ? selectedIntervals.filter(i => i !== minutes)
      : [...selectedIntervals, minutes].sort((a, b) => b - a);
    
    setSelectedIntervals(newIntervals);
    setNotificationIntervals(newIntervals);
  };

  const completedCount = events.filter(e => e.completed).length;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ Settings</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-content">
          
          {/* Window Settings */}
          <section className="settings-section">
            <h3>Window</h3>
            
            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={alwaysOnTop}
                  onChange={toggleAlwaysOnTop}
                />
                <span>Always on top</span>
              </label>
              <p className="setting-description">Keep widget above other windows</p>
            </div>

            <div className="setting-item">
              <label className="setting-label-text">Window Size</label>
              <div className="radio-group-vertical">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="windowSize"
                    value="compact"
                    checked={windowSize === 'compact'}
                    onChange={(e) => setWindowSize(e.target.value as any)}
                  />
                  <span>Compact (300×400)</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="windowSize"
                    value="standard"
                    checked={windowSize === 'standard'}
                    onChange={(e) => setWindowSize(e.target.value as any)}
                  />
                  <span>Standard (350×550)</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="windowSize"
                    value="expanded"
                    checked={windowSize === 'expanded'}
                    onChange={(e) => setWindowSize(e.target.value as any)}
                  />
                  <span>Expanded (400×700)</span>
                </label>
              </div>
            </div>
          </section>

          {/* Notification Settings */}
          <section className="settings-section">
            <h3>Notifications</h3>
            <p className="setting-description">Choose when to be notified before events</p>
            
            <div className="checkbox-list">
              {intervalOptions.map((option) => (
                <label key={option.value} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedIntervals.includes(option.minutes)}
                    onChange={() => handleIntervalToggle(option.minutes)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Data Management */}
          <section className="settings-section">
            <h3>Data</h3>
            
            <div className="setting-item">
              <label className="setting-label-text">Events</label>
              <p className="setting-description">
                {events.length} total events • {completedCount} completed
              </p>
            </div>
          </section>

        </div>

        <div className="settings-footer">
          <button className="btn-close" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}