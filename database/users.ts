type User = {
  id: number;
  username: string;
  fullName: string;
  location: string;
  email: string;
  createdAt: Date;
};

type UserWithPasswordHash = User & {
  passwordHash: string;
};
