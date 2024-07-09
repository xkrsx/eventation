// works for not logged users too

export default function FindEvent() {
  return (
    <div className="wrapper">
      <div className="event">
        <h1>Find event</h1>
        {/* TODO add functionality to the form */}
        <form>
          <label>
            Name
            <input />
          </label>
          <label>
            Start time
            <input type="time" />
            <input type="date" />
          </label>
          <label>
            End time
            <input type="time" />
            <input type="date" />
          </label>
          <label>
            Price from <input type="number" />
            to
            <input type="number" />
          </label>
          <button>Find event</button>
        </form>
      </div>
    </div>
  );
}
