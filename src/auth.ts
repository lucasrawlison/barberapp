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
          throw new Error("Email e senha são obrigatórios.");
        }

        if (typeof credentials.email !== "string") {
          return null
          throw new Error("string.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null
          throw new Error("Usuário não encontrado.");
        }

        // 🔹 Comparando senha com bcrypt
        // const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        // if (!isValidPassword) {
        //   throw new Error("s errada.");
        // }

        if(credentials.password !== user.password){
          return null
          throw new Error("Senha incorreta")
        }

        return { id: user.id, email: user.email, name: user.name, image: user.profileImgLink };
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
