import Login from '../(auth)/login/Login';
import Register from '../(auth)/register/RegisterForm';
import TwoTabs from '../common/Tabs/TwoTabs';

type Props = { returnTo?: string | string[] };

export default function ProfileNotLogged(props: Props) {
  return (
    <div>
      <h1>Log in/Register</h1>
      <TwoTabs
        tabOne={{
          comp: <Login returnTo={props.returnTo} />,
          name: 'Log in',
        }}
        tabTwo={{
          comp: <Register returnTo={props.returnTo} />,
          name: 'Register',
        }}
      />{' '}
    </div>
  );
}
