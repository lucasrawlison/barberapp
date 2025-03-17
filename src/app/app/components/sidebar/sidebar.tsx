import { Home, CheckSquare, Settings, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface SidebarProps {
  open: boolean
  onClose: () => void
  isMobile: boolean
}

export function Sidebar({ open, onClose, isMobile }: SidebarProps) {
  const sidebarContent = (
    <nav className="flex flex-col py-4">
      <Link
        href="/app/dashboard"
        className="flex items-center px-6 pt-6 py-3 text-gray-600 hover:bg-gray-100"
        onClick={isMobile ? onClose : undefined}
      >
        <Home className="h-5 w-5 mr-3" />
        <span className="text-sm font-medium">Dashboard</span>
      </Link>
      <Link
        href="/app/services"
        className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
        onClick={isMobile ? onClose : undefined}
      >
        <CheckSquare className="h-5 w-5 mr-3" />
        <span className="text-sm font-medium">Serviços</span>
      </Link>
      <Link
        href="/app/financial"
        className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
        onClick={isMobile ? onClose : undefined}
      >
        <DollarSign className="h-5 w-5 mr-3" />
        <span className="text-sm font-medium">Financeiro</span>
      </Link>
      <Link
        href="/app/users"
        className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
        onClick={isMobile ? onClose : undefined}
      >
        <Users className="h-5 w-5 mr-3" />
        <span className="text-sm font-medium">Usuários</span>
      </Link>
      <Link
        href="/app/settings"
        className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
        onClick={isMobile ? onClose : undefined}
      >
        <Settings className="h-5 w-5 mr-3" />
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
    <div className={`bg-white w-64 min-h-screen flex-shrink-0 ${open ? "" : "hidden"} md:block`}>
      <div className="flex justify-center items-center h-16 border-b">
        <h2 className="text-2xl font-semibold">Agile Barber</h2>
      </div>
      {sidebarContent}
    </div>
  )
}

