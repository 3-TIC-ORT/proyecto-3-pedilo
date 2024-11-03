'use client';
import React from 'react';
import { usePopup } from '@/context/PopupContext';

const Popups = () => {
  const { popups } = usePopup();

  return (
    <div className="popups">
      {popups.map((popup) => (
        <div
          key={popup.id}
          className={`popup ${popup.isError ? 'popupError' : ''}`}
        >
          <p>
            {popup.message}
          </p>
          {/* <div className="closePopup">
            <img src="/media/crossIcon2.svg" alt="" />
          </div> */}
        </div>
      ))}
    </div>
  );
};

export default Popups;

//Para usar los popups:
//import { usePopup } from '@/context/PopupContext';
//const { addPopup } = usePopup();
//addPopup('Este es un mensaje de información', false);
//addPopup('Este es un mensaje de error', true);
