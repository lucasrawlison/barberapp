import { ServicesList } from "./components/servicesList"

export default function ServicesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className=" ml-8 text-3xl font-bold tracking-tight">Serviços</h1>
      </div>
      <ServicesList />
    </div>
  )
}

