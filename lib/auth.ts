import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user }) {
      // Allow multiple admin emails (comma-separated in env variable)
      const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
      // Also support legacy single ADMIN_EMAIL for backwards compatibility
      const legacyEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      if (legacyEmail) adminEmails.push(legacyEmail);
      
      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
        return true;
      }
      return '/admin/login?error=AccessDenied';
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
