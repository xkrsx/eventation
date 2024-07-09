export default function FindEvent() {
  return (
    <div className="wrapper">
      <div className="event">
        <h1>Find event</h1>
        <form>
          <label>
            Name
            <input />
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
