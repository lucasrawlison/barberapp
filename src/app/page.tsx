"use client"
import { LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading") {
      if (!session?.user) {
        router.push("/login");
      }else{
        router.push("/app/dashboard");
      }
    }
  }, [session, status, router]); // Dependências para evitar loops infinitos

  // Exibe a tela de carregamento enquanto aguarda a autenticação
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center gap-4">
      <span className="text-sm">Carregando...</span>
      <LoaderCircle className="animate-spin"/>
    </div>
  );
}
