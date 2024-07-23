import LoginForm from '../(auth)/login/LoginForm';
import RegisterForm from '../(auth)/register/RegisterForm';
import TwoTabs from '../common/Tabs/TwoTabs';

export default function Auth() {
  return (
    <div>
      <h1>Log in/Register</h1>
      <TwoTabs
        tabOne={{
          comp: <LoginForm />,
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
