'use client';

import React from 'react';
import { Event } from '../../../database/events';
import { generateIcs } from '../../../util/generateIcs';

type DownloadIcsButtonProps = {
  event: Event;
};

const DownloadIcsButton: React.FC<DownloadIcsButtonProps> = ({ event }) => {
  const handleDownloadIcs = () => {
    console.log(event);
    const icsContent = generateIcs(event);
    console.log(icsContent);
    if (icsContent) {
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${event.name}.ics`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <button className="logout-button menu-icon" onClick={handleDownloadIcs}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="#5f6368"
      >
        <path d="M680-80v-120H560v-80h120v-120h80v120h120v80H760v120h-80Zm-480-80q-33 0-56.5-23.5T120-240v-480q0-33 23.5-56.5T200-800h40v-80h80v80h240v-80h80v80h40q33 0 56.5 23.5T760-720v244q-20-3-40-3t-40 3v-84H200v320h280q0 20 3 40t11 40H200Zm0-480h480v-80H200v80Zm0 0v-80 80Z" />
      </svg>
    </button>
  );
};

export default DownloadIcsButton;
