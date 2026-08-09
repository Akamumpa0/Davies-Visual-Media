import React from 'react';

export default function Spinner({ size = '40px', color = 'var(--accent-primary)' }) {
    return (
        <div className="spinner-container">
            <div 
                className="spinner" 
                style={{ width: size, height: size, borderTopColor: color }}
            ></div>
        </div>
    );
}
