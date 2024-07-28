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

  return <button onClick={handleDownloadIcs}>Download ICS</button>;
};

export default DownloadIcsButton;
