export type EventCategory = 'personal' | 'business';

export type EventSubcategory =
  | 'birthday'
  | 'anniversary'
  | 'baby-due'
  | 'vacation'
  | 'family-event'
  | 'deadline'
  | 'meeting'
  | 'quarterly-review'
  | 'product-launch'
  | 'board-meeting'
  | 'other';

export interface Event {
  id: string;
  title: string;
  subtitle?: string;
  category: EventCategory;
  subcategory: EventSubcategory;
  date: string;
  time?: string;
  isAllDay: boolean;
  isRecurring: boolean;
  recurrenceRule?: 'yearly' | 'monthly' | 'weekly';
  notes?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMinutes: number;
  isPast: boolean;
}

export type UrgencyLevel = 'normal' | 'soon' | 'urgent' | 'critical';

export interface EventWithCountdown extends Event {
  timeRemaining: TimeRemaining;
  urgency: UrgencyLevel;
}