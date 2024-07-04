type Props = {
  params: {
    username: string;
  };
};

export default function UserProfile(props: Props) {
  return (
    <div className="wrapper">
      <div className="profile">
        <h1>User: {props.params.username}</h1>
      </div>
    </div>
  );
}
