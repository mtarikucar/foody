import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

function Modal({ children, showCloseButton, title, description, size, isOpen, onClose }) {



    const sizeClasses = {
        small: "max-w-md",
        medium: "max-w-xl",
        large: "max-w-3xl",
        extraLarge: "max-w-7xl",
    };

    useEffect(() => {
        const handleEscClose = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscClose);
        return () => {
            window.removeEventListener('keydown', handleEscClose);
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50 "
            onClick={onClose}>
            <div className={`bg-white p-5 rounded-lg shadow-lg ${sizeClasses[size]} max-h-[84vh] overflow-y-auto w-full`}
                onClick={e => e.stopPropagation()}>
                {showCloseButton && (
                    <button onClick={onClose} className="float-right text-gray-700">
                        <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                )}
                {title && <div className="text-lg font-bold w-full">{title}</div>}
                {description && <p className="text-sm mt-2">{description}</p>}
                <div className="mt-4">{children}</div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    children: PropTypes.node,
    showCloseButton: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium", "large", "extraLarge"]),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

Modal.defaultProps = {
    showCloseButton: true,
};


export default Modal;
