import Login from '../(auth)/login/Login';
import RegisterForm from '../(auth)/register/RegisterForm';
import TwoTabs from '../common/Tabs/TwoTabs';

export default function ProfileNotLogged() {
  return (
    <div>
      <h1>Log in/Register</h1>
      <TwoTabs
        tabOne={{
          comp: (
            <Login
              searchParams={{
                returnTo: undefined,
              }}
            />
          ),
          name: 'Log in',
        }}
        tabTwo={{
          comp: <RegisterForm />,
          name: 'Register',
        }}
      />{' '}
    </div>
  );
}
