import React, { useState, useRef, useEffect } from 'react';

const useOutsideAlerter = (ref, callback) => {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);
};

export default function CustomDropdown({ label, options, value, onChange, placeholder = "Select an option" }) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, () => setIsOpen(false));

    const handleSelect = (optionValue) => {
        // Create a synthetic event object to mimic native onChange
        const event = { target: { value: optionValue } };
        onChange(event);
        setIsOpen(false);
    };

    return (
        <div className="dropdown-group" ref={wrapperRef}>
            <label>{label}</label>
            <div className="custom-dropdown">
                <button type="button" className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
                    {value || placeholder}
                </button>
                {isOpen && (
                    <ul className="dropdown-list">
                        {options.map((option) => (
                            <li key={option} className={`dropdown-item ${value === option ? 'selected' : ''}`} onClick={() => handleSelect(option)}>
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}