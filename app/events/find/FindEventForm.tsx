'use client';

import { useState } from 'react';
import FindEventAccurateForm from './AccurateForm';
import FindEventInaccurateForm from './InaccurateForm';

export default function FindEventForm() {
  const [accurate, setAccurate] = useState('inaccurate');

  const handleRadioChange = (value: string) => {
    setAccurate(value);
  };

  return (
    <div className="wrapper">
      <div className="event">
        Search engine:{' '}
        <input
          type="radio"
          id="inaccurate"
          value="inaccurate"
          checked={accurate === 'inaccurate'}
          onChange={() => handleRadioChange('inaccurate')}
        />
        <label htmlFor="inaccurate">inaccurate</label>
        {' | '}
        <input
          type="radio"
          id="accurate"
          value="accurate"
          checked={accurate === 'accurate'}
          onChange={() => handleRadioChange('accurate')}
        />
        <label htmlFor="accurate">accurate</label>
        {accurate === 'inaccurate' ? (
          <FindEventInaccurateForm />
        ) : (
          <FindEventAccurateForm />
        )}
      </div>
    </div>
  );
}
