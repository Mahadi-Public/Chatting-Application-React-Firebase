import React from 'react';
import { createPortal } from 'react-dom';

const recorderModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-100 backdrop-blur-sm">
            <div className="bg-white p-5 rounded-md">
                <button onClick={onClose} className="absolute top-2 right-2">X</button>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default recorderModal;