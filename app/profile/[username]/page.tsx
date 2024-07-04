type Props = {
  params: {
    username: string;
  };
};
// when logged out: login/registration forms
// when logged in: view with settings, links to event manager etc
export default function UserProfile(props: Props) {
  return (
    <div className="wrapper">
      <div className="profile">
        <h1>User: {props.params.username}</h1>
      </div>
    </div>
  );
}
