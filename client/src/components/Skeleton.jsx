import React from 'react';

export default function Skeleton({ width = '100%', height = '20px', borderRadius = '4px', style = {} }) {
    const defaultStyles = {
        width,
        height,
        borderRadius,
        backgroundColor: '#1a1a1a', // Assuming dark theme
        animation: 'pulse 1.5s ease-in-out infinite',
        ...style
    };

    return <div style={defaultStyles} className="skeleton"></div>;
}
