type Props = {
  username: string | null;
  className?: string;
};

export default function TextAvatar({ username, className }: Props) {
  const initials = username ? username.charAt(0).toLowerCase() : '';

  return (
    <div
      className={`w-10 h-10 flex items-center justify-center rounded-full bg-red-950 text-white ${className}`}
    >
      {initials}
    </div>
  );
}
