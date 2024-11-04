"use client";

export default function CallWaiterBtn() {
    

    return (
        <>
            <button id="callWaiterBtn">Llamar Mozo</button>
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
