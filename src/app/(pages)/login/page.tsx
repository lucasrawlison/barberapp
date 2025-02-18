"use client";
import LoginForm from "./components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Entre com as credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-500">Or continue with</span>
          </div>
          <div className="mt-4 w-full flex justify-center">
            
          </div> 
        </CardContent>
      </Card>
    </div>
  );
}
