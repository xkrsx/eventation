import AllEventsByDate from './events/AllEventsByDate';

// import HomeEvents from './HomeEvents';

export default function Home() {
  return (
    <div className="wrapper">
      <h1>MAIN PAGE</h1>
      {/* <HomeEvents /> */}
      <AllEventsByDate />
    </div>
  );
}
