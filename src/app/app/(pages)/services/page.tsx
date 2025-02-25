import { ServicesList } from "./components/servicesList"

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-10 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className=" ml-8 text-3xl font-bold tracking-tight">Serviços</h1>
      </div>
      <ServicesList />
    </div>
  )
}

