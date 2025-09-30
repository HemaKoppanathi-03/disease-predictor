
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="
          w-16 h-16
          border-4 border-blue-200
          border-t-blue-600
          rounded-full
          animate-spin
        "
        role="status"
        aria-label="Loading..."
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
