"use client"
import { useEffect, useState } from "react";
import { Header } from "./components/header/header";
import { Sidebar } from "./components/sidebar/sidebar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LoaderCircle } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  useEffect(() => {
    if (status !== "loading") {
      if (!session?.user) {
        router.push("/login");
      } 
    }
  }, [session, status, router]); // Dependências para evitar loops infinitos


  if(status === "loading") {
    return (
      <div className="flex flex-col w-screen h-screen items-center justify-center gap-4">
        <span className="text-sm">Carregando...</span>
        <LoaderCircle className="animate-spin"/>
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        {children}
      </div>
    </div>
  );
}
