"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import AddUser from "./components/addUser";
import { Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function Dashboard(){
  interface User {
    id: string;
    isRoot: boolean;
    name: string;
    email: string;
    login: string;
    profileType: string;
    profileImgLink: string;
    active: boolean;
  }
  const [isLoading, setIsloading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User | null>(null);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const {data: session} = useSession();
  
  const getActiveUser = async () => {
    if(!session?.user?.id) return;
    try {
      const response = await axios.post("/api/getActiveUser", {
        id: session?.user?.id
      })
      
      if(response) {
        setActiveUser(response.data);
        setIsloading(false);
      }
    } catch (error) {
      setIsloading(false);
      console.log(error)
    }
  }
  
  const getUsers = async () => {
    setIsloading(true);

    try {
      const response = await axios.post("/api/getUsers");
      if (response) {
        setUsers(response.data.users);
        setIsloading(false);
      }
    } catch (error) {
      setIsloading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);
  
  useEffect(()=> {
    getActiveUser();
  }, [session?.user?.id])

  return (
    <div className="container mx-auto p-6 overflow-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuários</h1>
      </header>
      <div className="w-full flex flex-row justify-end mb-4">
    <Button onClick={() =>setNewUser({
        id: "",
        isRoot: false,
        name: "",
        email: "",
        login: "",
        profileType: "barber",
        profileImgLink: "",
        active: true,
    })}><Plus/> Novo Usuário</Button>
      </div>
      {isLoading && (
        <div className="h-1 bg-slate-400 w-full overflow-hidden relative">
          <div className="w-1/2 bg-sky-500 h-full animate-slideIn absolute left-0 rounded-lg"></div>
        </div>
      )}
      <div className=" grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map((user) => (
          <Card
            onClick={() => setSelectedUser(user)}
            key={user.id}
            className={
              user.active
                ? "hover:bg-gray-50 hover:cursor-pointer shadow-md  transition-all duration-100 ease-in-out"
                : "bg-red-100 hover:cursor-pointer shadow-md  transition-all duration-100 ease-in-out"
            }
          >
            <CardHeader className="text-wrap flex overflow-hidden">
              <CardTitle className="text-wrap">
                <div className="w-full flex felx-row items-center justify-between">
                  <span>{user.name}</span>
                  {!user.active && (

                  <span className="text-red-700 text-xs">INATIVO</span>
                  )}
                  
                </div>
              </CardTitle>
              <CardDescription className="text-balance text-xs">
                {user.email}
              </CardDescription>
              {/* <span className="text-slate-500">
                      {user.email}
                    </span> */}
            </CardHeader>
            <CardContent>
              <div className="flex flex-row items-cente w-full">
                <div className="w-full h-full flex flex-col">
                  <span className="text-xs  text-slate-500">
                    {"Apelido: " + user.login}
                  </span>
                  <span
                    className={`font-semibold text-xs ${
                      user.profileType === "admin"
                        ? "text-blue-800"
                        : "text-green-800"
                    }`}
                  >
                    {user.profileType === "admin"
                      ? "Administrador"
                      : "Barbeiro"}
                  </span>
                </div>
                <div className="w-full h-full flex justify-center">
                  {user.profileImgLink ? (
                    <Image
                      className="rounded-full"
                      width={60}
                      height={60}
                      alt={user?.name}
                      src={user?.profileImgLink}
                    />
                  ) : (
                    <User size={60} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddUser
      activeUser={activeUser}
      setNewUser={setNewUser}
      newUser={newUser}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        getUsers={getUsers}
      />
    </div>
  );
}
