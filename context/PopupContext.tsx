'use client';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface Popup {
  message: string;
  id: number;
  isError?: boolean;
}

interface PopupContextType {
  popups: Popup[];
  addPopup: (message: string, isError?: boolean) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [popups, setPopups] = useState<Popup[]>([]);

  const addPopup = (message: string, isError: boolean = false) => {
    const newPopup = { message, id: Date.now() + Math.random(), isError };
    setPopups((prev) => [...prev, newPopup]);

    // Eliminar el popup automáticamente después de 3 segundos
    setTimeout(() => {
      setPopups((prev) => prev.filter((popup) => popup.id !== newPopup.id));
    }, 3000);
  };

  return (
    <PopupContext.Provider value={{ popups, addPopup }}>
      {children}
    </PopupContext.Provider>
  );
};
