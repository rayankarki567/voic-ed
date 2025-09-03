import { hash, compare } from 'bcryptjs'

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, 12)
}

// Password verification
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await compare(password, hashedPassword)
}

// Supabase Auth configuration
export const authConfig = {
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
}
