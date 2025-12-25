import { useCountdown } from '@hooks/useCountdown';
import { useEventStore } from '@store/eventStore';
import { Event } from '@types/event';
import './EventCard.css';

const subcategoryIcons: Record<string, string> = {
  birthday: '🎂',
  anniversary: '💕',
  'baby-due': '👶',
  vacation: '✈️',
  'family-event': '🎉',
  deadline: '📊',
  meeting: '🤝',
  'quarterly-review': '📈',
  'product-launch': '🚀',
  'board-meeting': '📋',
  other: '📌',
};

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const { deleteEvent } = useEventStore();
  const countdown = useCountdown(event.date, event.time);

  const handleDelete = () => {
    if (window.confirm(`Delete "${event.title}"?`)) {
      deleteEvent(event.id);
    }
  };

  const icon = subcategoryIcons[event.subcategory] || '📌';

  return (
    <div className={`event-card ${event.category} ${countdown.urgency}`}>
      <div className="event-card-left">
        <span className="event-icon">{icon}</span>
        <div className="event-info">
          <h3 className="event-title">{event.title}</h3>
          {event.subtitle && <p className="event-subtitle">{event.subtitle}</p>}
          <p className="event-date-small">
            {event.date}
            {event.time && ` at ${event.time}`}
          </p>
        </div>
      </div>

      <div className="event-card-right">
        <div className="countdown">
          <span className="countdown-value">{countdown.text}</span>
        </div>
        <button className="delete-btn" onClick={handleDelete} title="Delete event">
          ✕
        </button>
      </div>
    </div>
  );
}