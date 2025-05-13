// src/components/ui/card.tsx
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export const Card: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">{children}</div>
  );
};

export const CardContent: React.FC<Props> = ({ children }) => {
  return <div className="space-y-4">{children}</div>;
};
