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
  saveEvents: () => Promise<void>;
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

    set((state) => ({
      events: [...state.events, newEvent].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    }));

    // Auto-save after adding
    get().saveEvents();
  },

  updateEvent: (id, updates) => {
    set((state) => ({
      events: state.events
        .map((event) =>
          event.id === id
            ? { ...event, ...updates, updatedAt: new Date().toISOString() }
            : event
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    }));

    // Auto-save after updating
    get().saveEvents();
  },

  deleteEvent: (id) => {
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    }));

    // Auto-save after deleting
    get().saveEvents();
  },

  completeEvent: (id) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id
          ? { ...event, completed: true, updatedAt: new Date().toISOString() }
          : event
      ),
    }));

    // Auto-save after completing
    get().saveEvents();
  },

  loadEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const storedEvents = await window.electronAPI.getStoreValue('events');
      if (storedEvents && Array.isArray(storedEvents)) {
        set({ events: storedEvents, isLoading: false });
      } else {
        set({ events: [], isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      set({ error: 'Failed to load events', isLoading: false });
    }
  },

  saveEvents: async () => {
    try {
      await window.electronAPI.setStoreValue('events', get().events);
    } catch (error) {
      console.error('Failed to save events:', error);
      set({ error: 'Failed to save events' });
    }
  },
}));