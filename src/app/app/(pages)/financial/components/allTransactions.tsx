import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCallback } from "react"

interface Transaction {
    date: string,
    description: string,
    type: string,
    value: number

}

interface allTransactionsProps {
    transactions : Transaction[]
    isLoading: boolean
}

export function AllTransactions ({transactions, isLoading} : allTransactionsProps) {

  const handleConvertDate = useCallback((date: string) => {
      const newDate = new Date(date)
  
      const formattedDate = newDate.toLocaleString("pt-BR", {
        
        day: "2-digit",
        month: "2-digit",
        year : "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
  
      return formattedDate
    }, [])
    return (
        <Card>
            <CardHeader>
              <CardTitle>Todas as Transações</CardTitle>
              <CardDescription>Lista completa de todas as suas transações financeiras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Input placeholder="Search transactions..." className="max-w-sm" />
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as transações</SelectItem>
                    <SelectItem value="income">Apenas receitas</SelectItem>
                    <SelectItem value="expense">Apenas despesa</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Novos primeiro</SelectItem>
                    <SelectItem value="oldest">Antigos primeiro</SelectItem>
                    <SelectItem value="highest">Maiores</SelectItem>
                    <SelectItem value="lowest">Menores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {isLoading && (
          <div className="h-1 bg-slate-400 w-full overflow-hidden relative">
            <div className="w-1/2 bg-sky-500 h-full animate-slideIn absolute left-0 rounded-lg"></div>
          </div>
        )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction, index=0) => (
                    <TableRow key={index + 1}>
                      <TableCell>{handleConvertDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            transaction.type === "Receita"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            transaction.type === "Receita"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {transaction.type === "income" ? "+" : "-"}${transaction.value.toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled>
                Anterior
              </Button>
              <Button variant="outline">Próximo</Button>
            </CardFooter>
          </Card>
    )
}