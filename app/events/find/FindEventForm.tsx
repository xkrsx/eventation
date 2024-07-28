'use client';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import { useState } from 'react';
import { ZodIssue } from 'zod';
import { Event } from '../../../database/events';
import { Session } from '../../../migrations/00001-createTableSessions';
import SingleEventNotLogged from '../../common/SingleEvent/SingleEventNotLogged';
import FindEventInaccurateForm from './InaccurateForm';

// import ErrorMessage from '../../ErrorMessage';

type Props = {
  session: Omit<Session, 'id'> | undefined;
};

export default function FindEventForm(props: Props) {
  // const [accurate, setAccurate] = useState('inaccurate');
  // const [errorMessage, setErrorMessage] = useState('');
  const [results, setResults] = useState<Event[]>([]);

  // const handleRadioChange = (value: string) => {
  //   setAccurate(value);
  // };

  function addSearchResults(events: Event[] | string | ZodIssue[]) {
    if (typeof events === 'object') {
      return setResults(events as Event[]);
    }
  }

  return (
    <div>
      {/* <div className="search-engine">
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
      </div> */}
      <FindEventInaccurateForm addResultsToShow={addSearchResults} />

      <div className="results">
        {/* <ErrorMessage>{errorMessage}</ErrorMessage> */}
        {results.length !== 0 && (
          <>
            <button
              className="button-action"
              onClick={(event) => {
                event.preventDefault();
                setResults([]);
              }}
            >
              Clear results
            </button>
            <h2>Results</h2>

            {results.map((event) => (
              <SingleEventNotLogged key={`key-${event.id}`} event={event} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
