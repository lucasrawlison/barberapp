import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", required: true, type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials.email || credentials.password) {
          return null;
        }

        if (typeof credentials.email != "string") {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        if (credentials.password !== user.password) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.profileImgLink,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login", // Página customizada de login
    error: "/login",
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
    async redirect({}) {
      return "/app/dashboard";
    },
  },
  debug: true, // Mostra logs detalhados no terminal
}); 