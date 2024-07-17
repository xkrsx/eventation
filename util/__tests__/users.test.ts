import { expect, test } from '@jest/globals';
import { getUserPublicByIdInsecure, User } from '../../database/users';

test('Getting user by ID, insecure', () => {
  expect(getUserPublicByIdInsecure(1)).toContainEqual({ user });
});
