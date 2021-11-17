import React from 'react';

const Dots: React.FC<{className?: string}> = ({ className }) => {
  return (
    <div className={`${className} flex items-center h-full`}>
      <div className="rounded-full mr-0.5 bg-gray-500 h-1 w-1" />
      <div className="rounded-full mr-0.5 bg-gray-500 h-1 w-1" />
      <div className="rounded-full bg-gray-500 h-1 w-1" />
    </div>
  );
};

export default React.memo(Dots);