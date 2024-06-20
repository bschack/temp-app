import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export const verifyPassword = async (plainPassword: string, hashedPassword: string) => {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  return match;
}
