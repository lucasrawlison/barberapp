"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import AddUser from "./components/addUser";
import { User } from "lucide-react";

export default function Dashboard(){
  interface User {
    id: string;
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

  return (
    <div className="container mx-auto p-6 overflow-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuários</h1>
      </header>
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
            className="hover:bg-gray-50 hover:cursor-pointer shadow-md  transition-all duration-100 ease-in-out"
          >
            <CardHeader className="text-wrap flex overflow-hidden">
              <CardTitle className="text-wrap">{user.name}</CardTitle>
              <CardDescription className="text-balance text-xs">
                {user.email}
              </CardDescription>
              {/* <span className="text-slate-500">
                      {user.email}
                    </span> */}
            </CardHeader>
            <CardContent>
              <div className="flex flex-row items-center  w-full">
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
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        getUsers={getUsers}
      />
    </div>
  );
}
