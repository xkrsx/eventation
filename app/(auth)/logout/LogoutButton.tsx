'use client';
import { useRouter } from 'next/navigation';
import { logout } from './actions';

export default function LogoutButton() {
  const router = useRouter();
  return (
    <form style={{ flexDirection: 'row' }}>
      <button
        formAction={async () => {
          await logout();
          router.refresh();
        }}
      >
        logout
      </button>
    </form>
  );
}
