import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null

        const passwordsPath = path.join(process.cwd(), 'public', 'passwords.json');
        const passwordsFile = fs.readFileSync(passwordsPath, 'utf8');
        const passwords = JSON.parse(passwordsFile);

        if (passwords[credentials.username]) {
          const isValid = await bcrypt.compare(credentials.password, passwords[credentials.username]);
          if (isValid) {
            return { id: credentials.username, name: credentials.username };
          }
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/staff/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    }
  }
});