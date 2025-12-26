import { useState } from 'react';
import { Event, EventCategory, EventSubcategory } from '@types/event';
import { useEventStore } from '@store/eventStore';
import './AddEventModal.css';

interface EditEventModalProps {
  event: Event;
  onClose: () => void;
}

export default function EditEventModal({ event, onClose }: EditEventModalProps) {
  const { updateEvent } = useEventStore();
  
  const [title, setTitle] = useState(event.title);
  const [subtitle, setSubtitle] = useState(event.subtitle || '');
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time || '');
  const [category, setCategory] = useState<EventCategory>(event.category);
  const [subcategory, setSubcategory] = useState<EventSubcategory>(event.subcategory);
  const [isRecurring, setIsRecurring] = useState(event.isRecurring);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date) {
      alert('Please fill in event name and date');
      return;
    }

    updateEvent(event.id, {
      title,
      subtitle: subtitle || undefined,
      date,
      time: time || undefined,
      category,
      subcategory,
      isAllDay: !time,
      isRecurring,
      recurrenceRule: isRecurring ? 'yearly' : undefined,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Event</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Name *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Sarah's Birthday"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Subtitle (optional)</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g., Turning 30!"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Time (optional)</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="category"
                  value="personal"
                  checked={category === 'personal'}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                />
                <span>Personal</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="category"
                  value="business"
                  checked={category === 'business'}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                />
                <span>Business</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value as EventSubcategory)}
            >
              <optgroup label="Personal">
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="baby-due">Baby Due Date</option>
                <option value="vacation">Vacation</option>
                <option value="family-event">Family Event</option>
              </optgroup>
              <optgroup label="Business">
                <option value="deadline">Deadline</option>
                <option value="meeting">Meeting</option>
                <option value="quarterly-review">Quarterly Review</option>
                <option value="product-launch">Product Launch</option>
                <option value="board-meeting">Board Meeting</option>
              </optgroup>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
              <span>Recurring annually (for birthdays/anniversaries)</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}