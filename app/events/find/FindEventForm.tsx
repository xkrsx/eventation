'use client';

import { useState } from 'react';
import { ZodIssue } from 'zod';
import { Event } from '../../../database/events';
import { Session } from '../../../migrations/00001-createTableSessions';
import FindEventAccurateForm from './AccurateForm';
import FindEventInaccurateForm from './InaccurateForm';

type Props = {
  session: Omit<Session, 'id'> | undefined;
};

export default function FindEventForm(props: Props) {
  const [accurate, setAccurate] = useState('inaccurate');
  const [results, setResults] = useState<
    (Event | undefined)[] | (string | ZodIssue[])
  >([]);

  const handleRadioChange = (value: string) => {
    setAccurate(value);
  };

  function addSearchResults(
    events: (Event | undefined)[] | (string | ZodIssue[]),
  ) {
    setResults(events);
  }

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
          <FindEventInaccurateForm addResultsToShow={addSearchResults} />
        ) : (
          <FindEventAccurateForm addResultsToShow={addSearchResults} />
        )}
        <h2>Results</h2>
        {/* TODO FIX show results */}
        {/* <ErrorMessage>{results as string}</ErrorMessage> */}
        {/* {results.length >= 1 &&
          results.map((event) => (
            <SingleEventNotLogged key={`key-${event!.id}`} event={event} />
          ))} */}
      </div>
    </div>
  );
}
