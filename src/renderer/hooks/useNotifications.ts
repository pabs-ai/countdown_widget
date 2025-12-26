import { useEffect } from 'react';
import { useEventStore } from '@store/eventStore';
import { differenceInMinutes } from 'date-fns';

const NOTIFICATION_INTERVALS = [
  { minutes: 10080, label: '1 week before' },      // 7 days
  { minutes: 4320, label: '3 days before' },       // 3 days
  { minutes: 1440, label: '1 day before' },        // 1 day
  { minutes: 360, label: '6 hours before' },       // 6 hours
  { minutes: 60, label: '1 hour before' },         // 1 hour
];

export function useNotifications() {
  const { events } = useEventStore();

  useEffect(() => {
    // Request notification permission on first load
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Check notifications every minute
    const interval = setInterval(() => {
      checkNotifications();
    }, 60000); // 60 seconds

    // Check immediately on mount
    checkNotifications();

    return () => clearInterval(interval);
  }, [events]);

  const checkNotifications = () => {
    const now = new Date();

    events.forEach((event) => {
      if (event.completed) return;

      // Parse event date and time
      let eventDateTime: Date;
      if (event.time) {
        const [hours, minutes] = event.time.split(':').map(Number);
        eventDateTime = new Date(event.date);
        eventDateTime.setHours(hours, minutes, 0, 0);
      } else {
        eventDateTime = new Date(event.date);
        eventDateTime.setHours(9, 0, 0, 0); // Default to 9 AM for all-day events
      }

      const minutesUntilEvent = differenceInMinutes(eventDateTime, now);

      // Check each notification interval
      NOTIFICATION_INTERVALS.forEach((interval) => {
        const notificationKey = `notified-${event.id}-${interval.minutes}`;
        const hasNotified = localStorage.getItem(notificationKey);

        // If we're within 5 minutes of the notification time and haven't notified yet
        if (
          minutesUntilEvent <= interval.minutes &&
          minutesUntilEvent > interval.minutes - 5 &&
          !hasNotified
        ) {
          sendNotification(event.title, interval.label, event.subtitle);
          localStorage.setItem(notificationKey, 'true');
        }
      });

      // Clear notification flags for events that have passed
      if (minutesUntilEvent < 0) {
        NOTIFICATION_INTERVALS.forEach((interval) => {
          const notificationKey = `notified-${event.id}-${interval.minutes}`;
          localStorage.removeItem(notificationKey);
        });
      }
    });
  };

  const sendNotification = (title: string, timing: string, subtitle?: string) => {
    const body = subtitle ? `${timing}: ${subtitle}` : `${timing}`;

    // Send notification if permitted
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '🎯',
        requireInteraction: false,
      });
    }
  };
}