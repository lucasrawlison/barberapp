import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        if(typeof credentials.email !== "string" ){
          return null
        }

        // Buscando o usuário no banco de dados
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        // Aqui você pode implementar a verificação de senha usando bcrypt ou outra ferramenta
        if (credentials.password !== user.password) {
          return null;
        }

        // Garantindo que o tipo de retorno esteja correto
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.profileImgLink || null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async redirect() {
      return "/app/dashboard";
    },
  },
  debug: true,
});
