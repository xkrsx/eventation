// authorised user (organiser) can edit selected event
// TODO add authorisation

export default function EditEvent() {
  return (
    <div className="wrapper">
      <div className="event">
        <h1>Edit event</h1>
        {/* TODO add API functionality */}
        {/* add picture upload */}
        {/* fix time editing */}
        {/* fix location */}
        {/* fix category */}
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
            Price
            <input type="number" />
          </label>
          <label>
            Description
            <input />
          </label>
          <label>
            Links
            <input />
          </label>
          <button>Add event</button>
        </form>
      </div>
    </div>
  );
}
