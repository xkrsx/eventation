'use client';
import { useRouter } from 'next/navigation';
import { logout } from './actions';

export default function LogoutButton() {
  const router = useRouter();
  return (
    <form>
      <button
        className="logout-button"
        formAction={async () => {
          await logout();
          router.refresh();
        }}
      >
        <svg
          className="menu-icon logout"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
        >
          <title id="logoutTitle">Log out button</title>
          <desc id="logoutDesc">Button to log out from user's profile.</desc>
          <path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h299v60H180v600h299v60H180Zm486-185-43-43 102-102H360v-60h363L621-612l43-43 176 176-174 174Z" />
        </svg>
      </button>
    </form>
  );
}
