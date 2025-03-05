"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {LoaderCircle} from "lucide-react"

export default function LoginForm() {
  const [userName, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null); // Limpa erros anteriores
    setIsLoading(true)
    const response = await signIn("credentials", {
      userName,
      password,
      redirect: false, // Evita redirecionamento automático
    });

      console.log(response)
    if(response?.error){
      setIsLoading(false)
      setLoginError(response.error);
    }else{
      console.log("Login bem-sucedido:", response);
      // Redirecionar manualmente após o login, se necessário
      setIsLoading(false)
      router.push("/app/dashboard");
    }
  };

  const getErrorMessage = (errorCode: string | null) => {
    if (!errorCode) return null;
    switch (errorCode) {
      case "CredentialsSignin":
        return "E-mail ou senha incorretos.";
      case "OAuthAccountNotLinked":
        return "Essa conta já está associada a outro método de login.";
      default:
        return "Ocorreu um erro ao tentar fazer login.";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Login</Label>
        <Input
          id="email"
          
          placeholder="Email or Username"
          value={userName}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {loginError && (
        <p className="w-full text-center text-red-500">
          {getErrorMessage(loginError)}
        </p>
      )}

      <Button disabled={isLoading} type="submit" className="w-full">
       {isLoading? (<LoaderCircle className=" animate-spin"/>) :"Entrar"}
      </Button>
    </form>
  );
}
