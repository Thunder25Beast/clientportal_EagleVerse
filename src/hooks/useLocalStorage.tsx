
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Hook for managing client data in localStorage
export function useClientsStorage() {
  const [clients, setClients] = useLocalStorage('salon-clients', []);
  
  const addClient = (client: any) => {
    setClients((prev: any[]) => [...prev, { ...client, id: Date.now().toString() }]);
  };

  const updateClient = (id: string, updates: any) => {
    setClients((prev: any[]) => 
      prev.map(client => client.id === id ? { ...client, ...updates } : client)
    );
  };

  const deleteClient = (id: string) => {
    setClients((prev: any[]) => prev.filter(client => client.id !== id));
  };

  return { clients, addClient, updateClient, deleteClient };
}

// Hook for managing analysis sessions
export function useAnalysisStorage() {
  const [sessions, setSessions] = useLocalStorage('salon-analysis-sessions', []);

  const addSession = (session: any) => {
    setSessions((prev: any[]) => [...prev, { ...session, id: Date.now().toString() }]);
  };

  const getClientSessions = (clientId: string) => {
    return sessions.filter((session: any) => session.clientId === clientId);
  };

  return { sessions, addSession, getClientSessions };
}
