import { create } from 'zustand';
import { Event } from '@types/event';

interface EventStore {
  events: Event[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  completeEvent: (id: string) => void;
  loadEvents: () => Promise<void>;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,

  addEvent: (eventData) => {
    const newEvent: Event = {
      ...eventData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => {
      const updatedEvents = [...state.events, newEvent].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Auto-save after adding
      window.electronAPI.setStoreValue('events', updatedEvents);
      
      return { events: updatedEvents };
    });
  },

  updateEvent: (id, updates) => {
    set((state) => {
      const updatedEvents = state.events
        .map((event) =>
          event.id === id
            ? { ...event, ...updates, updatedAt: new Date().toISOString() }
            : event
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Auto-save after updating
      window.electronAPI.setStoreValue('events', updatedEvents);
      
      return { events: updatedEvents };
    });
  },

  deleteEvent: (id) => {
    set((state) => {
      const updatedEvents = state.events.filter((event) => event.id !== id);
      
      // Auto-save after deleting
      window.electronAPI.setStoreValue('events', updatedEvents);
      
      return { events: updatedEvents };
    });
  },

  completeEvent: (id) => {
    set((state) => {
      const updatedEvents = state.events.map((event) =>
        event.id === id
          ? { ...event, completed: true, updatedAt: new Date().toISOString() }
          : event
      );
      
      // Auto-save after completing
      window.electronAPI.setStoreValue('events', updatedEvents);
      
      return { events: updatedEvents };
    });
  },

  loadEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const storedEvents = await window.electronAPI.getStoreValue('events');
      if (storedEvents && Array.isArray(storedEvents)) {
        // Process recurring events
        const processedEvents = storedEvents.map((event) => {
          if (event.isRecurring && event.recurrenceRule === 'yearly') {
            // Parse the event date
            const eventDate = new Date(event.date + 'T00:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // If the event's date (this year) has passed, move it to next year
            const thisYearDate = new Date(eventDate);
            thisYearDate.setFullYear(today.getFullYear());
            
            if (thisYearDate < today) {
              // Move to next year
              const nextYearDate = new Date(thisYearDate);
              nextYearDate.setFullYear(today.getFullYear() + 1);
              
              return {
                ...event,
                date: nextYearDate.toISOString().split('T')[0],
                completed: false,
              };
            } else if (eventDate.getFullYear() < today.getFullYear()) {
              // Event is from a past year, move to this year
              return {
                ...event,
                date: thisYearDate.toISOString().split('T')[0],
                completed: false,
              };
            }
          }
          return event;
        });
        
        set({ events: processedEvents, isLoading: false });
        
        // Save the updated events back if any were modified
        const hasChanges = processedEvents.some((event, index) => 
          event.date !== storedEvents[index]?.date
        );
        
        if (hasChanges) {
          await window.electronAPI.setStoreValue('events', processedEvents);
        }
      } else {
        set({ events: [], isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      set({ error: 'Failed to load events', isLoading: false });
    }
  },
}));