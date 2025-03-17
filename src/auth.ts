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
        userName: { label: "Login", placeholder: "Email or Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.userName || !credentials?.password) {
          return null
        }

        if (typeof credentials.userName !== "string" ) {
          return null
        }

        const user = await prisma.user.findFirst({
          where:{
            OR:[
              {email: credentials.userName},
              {login: credentials.userName}
            ]
          },
        });

        if (!user) {
          return null
        } 

        if(!user.active){
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
    // async redirect({}){
    //   return "/app/dashboard"
    // }
  },
  debug: true, // Mostra logs detalhados no terminal
});
