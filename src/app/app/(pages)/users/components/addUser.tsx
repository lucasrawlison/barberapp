"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { LoaderCircle, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    login: string;
    profileType: string;
    profileImgLink: string;
    active: boolean;
  }

interface AddUserProps {
    selectedUser: User | null;
    setSelectedUser: (user: User | null) => void;
    getUsers: () => Promise<void>;
}




export default function AddUser({ selectedUser, setSelectedUser, getUsers }: AddUserProps) {
      const [isSaving, setIsSaving] = useState(false);
      const [isDeleting, setIsDeleting] = useState(false);
      const [openDialog, setOpenDialog] = useState(false);

       useEffect(() => {
          if (selectedUser) {
            setOpenDialog(true);
          }
        }, [selectedUser]);


      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target;
          if (selectedUser) {
            setSelectedUser({
              ...selectedUser,
                [name]: value,
            });
          }
        };
    

    const handleUpdateUser = async () => {
        setIsSaving(true);
        if (!selectedUser) return;
        try {
           const response = await axios.post("/api/updateUser", {
            selectedUser
           })
    
           if(response.status === 200){
            setIsSaving(false);
            getUsers()
           }
        } catch (error) {
          console.log(error)
          setIsSaving(false);
          
        }
    
      }
    
  return (
    <div>
      {selectedUser && (
        <Dialog
          open={openDialog}
          onOpenChange={(open) => {
            setOpenDialog(open);
            setSelectedUser(null);
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
                    <Label className="text-slate-500 text-sm">
                      Tipo de perfil:
                    </Label>
                    <span className="text-sm">
                      {selectedUser?.profileType.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-row gap-3 items-center">
                    <Switch
                      checked={selectedUser?.active}
                      onCheckedChange={() => {
                        if (selectedUser) {
                            setSelectedUser({ ...selectedUser, active: !selectedUser.active });
                          }
                          
                      }}
                      id="active"
                    />

                    <Label
                      htmlFor="active"
                      className={
                        selectedUser?.active ? "text-green-800" : "text-red-800"
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
            <div className="flex flex-row gap-4 justify-end">
                {selectedUser?.profileType !== "admin" && (

              <Button variant="destructive" disabled={isDeleting}>
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