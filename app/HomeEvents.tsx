'use client';
import { useState } from 'react';
import AllEventsByDate from './events/AllEventsByDate';
import AllEventsByPrice from './events/AllEventsByPrice';

export default function HomeEvents() {
  const [sort, setSort] = useState('date');
  return (
    <div>
      <form>
        <label>
          <input
            type="radio"
            onClick={() => {
              setSort('date');
            }}
          />
          date
        </label>
        <label>
          <input
            type="radio"
            onClick={() => {
              setSort('price');
            }}
          />
          price
        </label>
      </form>
      <div>{sort === 'date' ? <AllEventsByDate /> : <AllEventsByPrice />}</div>
    </div>
  );
}
