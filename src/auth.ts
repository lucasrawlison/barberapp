import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt"; // 🔹 Importando bcrypt para comparar senhas

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@exemplo.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        if (typeof credentials.email !== "string") {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null
        }


        if(credentials.password !== user.password){
          return null
        }

        return { id: user.id, email: user.email, name: user.name, image: user.profileImgLink as string | null };
      },
    }),
  ],
  pages: {
    signIn: "/login", // Página customizada de login
    error: "/login"
  },
  callbacks: {
    async signIn({ user }) {
      if (!user) {
        throw new Error("Credenciais inválidas");
      }
      return true;
    },
    async session({ session, token }) {
      // 🔹 Adicionando ID do usuário à sessão
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      // 🔹 Guardando ID do usuário no token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async redirect({}){
      return "/app/dashboard"
    }
  },
  debug: true, // Mostra logs detalhados no terminal
});
