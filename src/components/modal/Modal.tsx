import React from 'react';
import './modal.css';
import {ModalProps} from "../../config/Config";

export default function Modal(prop: ModalProps) {
    if (!prop.show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    {prop.children}
                </div>
            </div>
        </div>
    );
};
