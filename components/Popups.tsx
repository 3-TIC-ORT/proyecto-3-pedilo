'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Popup {
  message: string;
  count: number;
  id: number;
  exit: boolean;
}

interface PopupContextType {
  addPopup: (message: string) => void;
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

  const addPopup = (message: string) => {
    setPopups(prev => {
      const existingPopup = prev.find(popup => popup.message === message);
      if (existingPopup) {
        return prev.map(popup =>
          popup.message === message
            ? { ...popup, count: popup.count + 1 }
            : popup
        );
      } else {
        return [...prev, { message, count: 1, id: Date.now(), exit: false }];
      }
    });
  };

  return (
    <PopupContext.Provider value={{ addPopup }}>
      {children}
      <div className="popups">
        {popups.map((popup, index) => (
          <div key={popup.id} className={`popup ${popup.exit ? 'popup-exit' : ''}`}>
            {popup.message} ({popup.count})
          </div>
        ))}
      </div>
    </PopupContext.Provider>
  );
};

const Popups = () => {
  const { addPopup } = usePopup();

  return null; // No need to render anything, as popups are handled in the context provider
};

export default Popups;