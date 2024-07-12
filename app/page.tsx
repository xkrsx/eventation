import { useState } from 'react';
import AllEventsByDate from './events/AllEventsByDate';
import AllEventsByPrice from './events/AllEventsByPrice';

export default function Home() {
  const [sort, setSort] = useState('date');
  return (
    <div className="wrapper">
      <h1>MAIN PAGE</h1>
      <form>
        <select>
          <option onClick={() => setSort('date')}>date</option>
          <option onClick={() => setSort('price')}>price</option>
        </select>
      </form>
      {sort === 'date' ? <AllEventsByDate /> : <AllEventsByPrice />}
    </div>
  );
}
