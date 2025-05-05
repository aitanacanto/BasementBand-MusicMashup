// src/components/ui/button.tsx
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
