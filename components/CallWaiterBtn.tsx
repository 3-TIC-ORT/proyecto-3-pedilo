// components/CallWaiterBtn.tsx
"use client";
import { newCall } from '@/actions/calls';
import { useState } from 'react';
import { usePopup } from '@/context/PopupContext';

interface CallWaiterBtnProps {
  tableNumber: number; // Adjusted to take just a number
}

export default function CallWaiterBtn({ tableNumber }: CallWaiterBtnProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addPopup } = usePopup();

  const handleCall = async () => {
    setIsLoading(true);
    try {
      const result = await newCall(tableNumber, "LLamado por el cliente");
      if (result) {
        addPopup('Mozo llamado exitosamente', false);
      } else {
        addPopup('Error al llamar al mozo', true);
      }
    } catch (error) {
      console.error("Error llamando al mozo", error);
      addPopup('Error al llamar al mozo', true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        id="callWaiterBtn"
        onClick={handleCall}
        disabled={isLoading}
        className="callWaiterBtn"
      >
        {isLoading ? "Llamando..." : "Llamar Mozo"}
      </button>
      <style>
        {`
          #callWaiterBtn {
            background-color: var(--dark-red);
            height: auto;
            width: 100%;
            border-radius: 8px;
            padding: 1rem 3rem;
            color: var(--white);
            font-weight: 600;
          }
        `}
      </style>
    </>
  );
}

