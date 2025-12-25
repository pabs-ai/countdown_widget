import { useState, useEffect } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, isPast } from 'date-fns';

export function useCountdown(targetDate: string, targetTime?: string) {
  const [timeRemaining, setTimeRemaining] = useState(() =>
    calculateTimeRemaining(targetDate, targetTime)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate, targetTime));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  return timeRemaining;
}

function calculateTimeRemaining(dateStr: string, timeStr?: string) {
  const now = new Date();
  
  let targetDateTime: Date;
  if (timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    targetDateTime = new Date(dateStr);
    targetDateTime.setHours(hours, minutes, 0, 0);
  } else {
    targetDateTime = new Date(dateStr);
    targetDateTime.setHours(23, 59, 59, 999);
  }

  const isPastDate = isPast(targetDateTime);

  if (isPastDate) {
    return {
      text: 'Past due',
      urgency: 'normal' as const,
      isPast: true,
    };
  }

  const days = differenceInDays(targetDateTime, now);
  const hours = differenceInHours(targetDateTime, now) % 24;
  const minutes = differenceInMinutes(targetDateTime, now);

  let text: string;
  let urgency: 'normal' | 'soon' | 'urgent' | 'critical';

  // Determine urgency and format text
  if (minutes <= 360) { // 6 hours
    text = `${hours}h ${minutes % 60}m`;
    urgency = 'critical';
  } else if (days === 0) { // Today
    text = `${hours} hours`;
    urgency = 'urgent';
  } else if (days === 1) { // Tomorrow
    text = `1 day, ${hours} hrs`;
    urgency = 'urgent';
  } else if (days <= 7) { // Within a week
    text = `${days} days`;
    urgency = 'soon';
  } else {
    text = `${days} days`;
    urgency = 'normal';
  }

  return {
    text,
    urgency,
    isPast: false,
  };
}