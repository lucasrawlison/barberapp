"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { LoaderCircle, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  isRoot: boolean;
  email: string;
  login: string;
  profileType: string;
  profileImgLink: string;
  active: boolean;
}

interface AddUserProps {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  setNewUser: (user: User | null) => void;
  getUsers: () => Promise<void>;
  newUser: User | null;
  activeUser: User | null;
}

export default function AddUser({
  newUser,
  selectedUser,
  setSelectedUser,
  setNewUser,
  getUsers,
  activeUser,
}: AddUserProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (selectedUser || newUser) {
      setOpenDialog(true);
    }
  }, [selectedUser, newUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        [name]: value,
      });
    }

    if (newUser) {
      setNewUser({
        ...newUser,
        [name]: value,
      });
    }
  };

  const handleUpdateUser = async () => {
    setIsSaving(true);
    if (!selectedUser) return;
    try {
      const response = await axios.post("/api/updateUser", {
        selectedUser,
      });

      if (response.status === 200) {
        setIsSaving(false);
        getUsers();
      }

      console.log(response);
    } catch (error) {
      console.log(error);
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    if (!selectedUser) return;
    try {
      const response = await axios.post("/api/deleteUser", {
        userToDelete: selectedUser,
      });

      if (response.status === 200) {
        setIsDeleting(false);
        setSelectedUser(null);
        getUsers();
        setOpenDialog(false);
      }
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error) && error.response) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Ocorreu um erro desconhecido.");
      }

      setIsDeleting(false);
    }
  };

  const handleCreateUser = async () => {
    setIsSaving(true);
    if (!newUser) return;
    try {
      const response = await axios.post("/api/createUser", {
        user: newUser,
      });

      if (response.status === 200) {
        setIsSaving(false);
        setSelectedUser(response.data.newUser);
        setNewUser(null);
        getUsers();
      }
    } catch (error) {
      console.log(error);
      setIsSaving(false);
    }
  };
  if (selectedUser) {
    return (
      <div>
        {selectedUser && (
          <Dialog
            open={openDialog}
            onOpenChange={(open) => {
              setOpenDialog(open);
              setSelectedUser(null);
              setNewUser(null);
              setErrorMsg(null);
            }}
          >
            <DialogContent className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedUser?.name}
                </DialogTitle>
                <DialogDescription>
                  Edite o usuário e salve as alterações
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-row w-full justify-between items-center pr-14">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-3 items-center">
                      <Label className="text-slate-500 text-sm text-nowrap">
                        Tipo de perfil:
                      </Label>
                      
                      <Select onValueChange={(value) => {
                        if (selectedUser) {
                          setSelectedUser({
                            ...selectedUser,
                            profileType: value,
                          });
                        }}}>
                        <SelectTrigger className="w-36 h-8 text-center">
                          <SelectValue placeholder={selectedUser.profileType}/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem className="hover:cursor-pointer" value="admin">Administrador</SelectItem>
                            <SelectItem className="hover:cursor-pointer" value="barber">Barbeiro</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-row gap-3 items-center">
                      <Switch
                        checked={selectedUser?.active}
                        onCheckedChange={() => {
                          if (selectedUser) {
                            setSelectedUser({
                              ...selectedUser,
                              active: !selectedUser.active,
                            });
                          }
                        }}
                        id="active"
                      />

                      <Label
                        htmlFor="active"
                        className={
                          selectedUser?.active
                            ? "text-green-800"
                            : "text-red-800"
                        }
                      >
                        {selectedUser?.active ? "Ativo" : "Inativo"}
                      </Label>
                    </div>
                  </div>

                  {selectedUser?.profileImgLink ? (
                    <Image
                      className="rounded-full"
                      width={80}
                      height={80}
                      alt={selectedUser?.name}
                      src={selectedUser?.profileImgLink}
                    />
                  ) : (
                    <User size={60} />
                  )}
                </div>
                <Label className="text-slate-500 text-sm">Nome</Label>
                <Input
                  name="name"
                  type="text"
                  value={selectedUser?.name}
                  className="border border-slate-300 rounded-md p-2"
                  onChange={handleInputChange}
                />
                <Label className="text-slate-500 text-sm">Email</Label>
                <Input
                  name="email"
                  type="text"
                  value={selectedUser?.email}
                  className="border border-slate-300 rounded-md p-2"
                  onChange={handleInputChange}
                />
                <Label className="text-slate-500 text-sm">Apelido</Label>
                <Input
                  name="login"
                  type="text"
                  value={selectedUser?.login}
                  className="border border-slate-300 rounded-md p-2"
                  onChange={handleInputChange}
                />
              </div>
              {errorMsg && (
                <span className=" text-red-600 text-sm w-full text-center">
                  {errorMsg}
                </span>
              )}
              <div className="flex flex-row gap-4 justify-end">
                {activeUser?.profileType === "admin" && (
                  <Button
                    onClick={handleDeleteUser}
                    variant="destructive"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <LoaderCircle className=" animate-spin" />
                    ) : (
                      "Deletar"
                    )}
                  </Button>
                )}

                <Button onClick={handleUpdateUser} disabled={isSaving}>
                  {isSaving ? (
                    <LoaderCircle className=" animate-spin" />
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  return (
    <div>
      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          setNewUser(null);
          setSelectedUser(null);
          setErrorMsg(null);
        }}
      >
        <DialogContent className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Novo Usuário
            </DialogTitle>
            <DialogDescription>
              Cadastre o usuário e salve as alterações
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-row w-full justify-between items-center pr-14">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-3 items-center">
                <Label className="text-slate-500 text-sm text-nowrap">
                        Tipo de perfil:
                      </Label>
                      
                      <Select onValueChange={(value) => {
                        if (newUser) {
                          setNewUser({
                            ...newUser,
                            profileType: value,
                          });
                        }}}>
                        <SelectTrigger className="w-36 h-8 text-center">
                          <SelectValue defaultValue="barber" placeholder="Barbeiro"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem className="hover:cursor-pointer" value="admin">Administrador</SelectItem>
                            <SelectItem className="hover:cursor-pointer" value="barber">Barbeiro</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                </div>
                <div className="flex flex-row gap-3 items-center">
                  <Switch
                    checked={newUser?.active}
                    onCheckedChange={() => {
                      if (newUser) {
                        setNewUser({ ...newUser, active: !newUser.active });
                      }
                    }}
                    id="active"
                  />

                  <Label
                    htmlFor="active"
                    className={
                      newUser?.active ? "text-green-800" : "text-red-800"
                    }
                  >
                    {newUser?.active ? "Ativo" : "Inativo"}
                  </Label>
                </div>
              </div>

              {newUser?.profileImgLink ? (
                <Image
                  className="rounded-full"
                  width={80}
                  height={80}
                  alt={newUser?.name}
                  src={newUser?.profileImgLink}
                />
              ) : (
                <User size={60} />
              )}
            </div>
            <Label className="text-slate-500 text-sm">Nome</Label>
            <Input
              name="name"
              type="text"
              value={newUser?.name ?? ""}
              className="border border-slate-300 rounded-md p-2"
              onChange={handleInputChange}
            />
            <Label className="text-slate-500 text-sm">Email</Label>
            <Input
              name="email"
              type="text"
              value={newUser?.email ?? ""}
              className="border border-slate-300 rounded-md p-2"
              onChange={handleInputChange}
            />
            <Label className="text-slate-500 text-sm">Apelido</Label>
            <Input
              name="login"
              type="text"
              value={newUser?.login ?? ""}
              className="border border-slate-300 rounded-md p-2"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-row gap-4 justify-end">
            <Button onClick={handleCreateUser} disabled={isSaving}>
              {isSaving ? (
                <LoaderCircle className=" animate-spin" />
              ) : (
                "Criar usuário"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
