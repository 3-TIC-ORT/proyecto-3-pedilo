'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Popup {
  message: string;
  count: number;
  id: number;
  exit: boolean;
  isError?: boolean;
}

interface PopupContextType {
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
    setPopups(prev => {
      const existingPopup = prev.find(popup => popup.message === message);
      if (existingPopup) {
        return prev.map(popup =>
          popup.message === message
            ? { ...popup, count: popup.count + 1 }
            : popup
        );
      } else {
        return [...prev, { message, count: 1, id: Date.now(), exit: false, isError }];
      }
    });
  };

  return (
    <PopupContext.Provider value={{ addPopup }}>
      {children}
      <div className="popups">
        {popups.map((popup) => (
          <div 
            key={popup.id} 
            className={`popup ${popup.exit ? 'popup-exit' : ''} ${popup.isError ? 'popupError' : ''}`}
          >
            {popup.message} {popup.count > 1 && `(${popup.count})`}
          </div>
        ))}
      </div>
    </PopupContext.Provider>
  );
};

export default PopupProvider;