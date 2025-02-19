import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {  List, Settings } from "lucide-react";
import { QuickRegister } from "./components/quickRegister/quickRegister";

export default function Dashboard(){


    const options = [
        
        {
            name: "Meus serviços",
            description: "Meus serviços",
            image: <List className="text-red-800"/>
            
        },
        {
            name: "Configurações",
            description: "Edite configurações do aplicativo",
            image: <Settings className="text-sky-800"/>
          }
        ]
        
        
        
        return (
          <div className="container mx-auto p-6 overflow-auto">
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Dashboard</h1>
            </header>

            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <QuickRegister/>

              {options.map((option) => (
                <Card
                  key={option.name}
                  className="hover:cursor-pointer h-36 hover:bg-slate-50"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="w-full text-center text-sm font-medium">
                      {option.description}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center mt-3 flex-row items-center space-x-2">
                      <div></div>
                      {option.image}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end mt-6"></div>
          </div>
        );
    
}