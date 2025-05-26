import { Home, CheckSquare, Settings, Users, DollarSign, CircleUserRound, CalendarCheck2 } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface User {
  id: string,
  name: string,
  email: string,
  profileType: string,
}
interface SidebarProps {
  open: boolean
  onClose: () => void
  isMobile: boolean
  user: User | undefined
  setPageTitle: (value: string)=> void
}


export function Sidebar({ open, onClose, isMobile, user, setPageTitle }: SidebarProps) {
  const sidebarContent = (
    <nav className="flex flex-col py-4">
      <Link
        href="/app/dashboard"
        className="group flex items-center px-6 pt-6 py-3 text-gray-600 hover:bg-gray-100"
        onClick={()=>{
          if(isMobile)onClose()
          setPageTitle("Dashboard")
          }
        } 
      >
        <Home className="group-hover:scale-105 h-5 w-5 mr-3" />
        <span className="text-sm font-medium">Dashboard</span>
      </Link>
      <Link
        href="/app/scheduling"
        className="group flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
        onClick={()=>{
          if(isMobile)onClose()
          setPageTitle("Serviços")
          }
        } 
      >
        <CalendarCheck2 className="group-hover:scale-105 h-5 w-5 mr-3" />
        <span className="text-sm font-medium">Agendamento</span>
      </Link>
      <Link
        href="/app/services"
        className="flex group items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
        onClick={()=>{
          if(isMobile)onClose()
          setPageTitle("Serviços")
          }
        } 
      >
        <CheckSquare className="group-hover:scale-105 h-5 w-5 mr-3" />
        <span className="text-sm font-medium">Serviços</span>
      </Link>
      {user?.profileType === "admin" && (
      <Link
        href="/app/financial"
        className="group flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
        onClick={()=>{
          if(isMobile)onClose()
          setPageTitle("Financeiro")
          }
        }       >
        <DollarSign className="group-hover:scale-105 h-5 w-5 mr-3" />
        <span className="text-sm font-medium">Financeiro</span>
      </Link>

      )}

      <Link
        href="/app/customers"
        className="group flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
        onClick={()=>{
          if(isMobile)onClose()
          setPageTitle("Clientes")
          }
        }      >
        <Users className="group-hover:scale-105 h-5 w-5 mr-3" />
        <span className="text-sm font-medium">Clientes</span>
      </Link>
      {user?.profileType === "admin" && (

      <Link
        href="/app/users"
        className="group flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
        onClick={()=>{
          if(isMobile)onClose()
          setPageTitle("Usuários")
          }
        }       >
        <CircleUserRound className="group-hover:scale-105 h-5 w-5 mr-3" />
        <span className="text-sm font-medium">Usuários</span>
      </Link>
      )}
      <Link
        href="/app/settings"
        className="group flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
        onClick={()=>{
          if(isMobile)onClose()
          setPageTitle("Configurações")
          }
        }      >
        <Settings className="group-hover:scale-105 h-5 w-5 mr-3" />
        <span className="text-sm font-medium">Configurações</span>
      </Link>
    </nav>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
          <SheetHeader>
            <SheetTitle></SheetTitle>
          </SheetHeader>
          {/* <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Todo App</h2>
          </div> */}
          {sidebarContent}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className={`border-r-2 bg-white w-64 min-h-screen flex-shrink-0 ${open ? "" : "hidden"} md:block`}>
      
      {sidebarContent}
    </div>
  )
}

