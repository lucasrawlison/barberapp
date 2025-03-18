import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

export  function NewTransaction () {
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova transação
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar nova transação</DialogTitle>
            <DialogDescription>
              Insira os detalhes da nova transação abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="transaction-type">Tipo de transação</Label>
              <RadioGroup defaultValue="income" id="transaction-type">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income">Receita</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense">Despesa</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Enter transaction description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Quantidade</Label>
              <Input id="amount" placeholder="0.00" type="number" step="0.01" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="services">Serviço</SelectItem>
                  <SelectItem value="products">Produto</SelectItem>
                  <SelectItem value="rent">Aluguel</SelectItem>
                  <SelectItem value="utilities">Utilidades</SelectItem>
                  <SelectItem value="supplies">Suprimentos</SelectItem>
                  <SelectItem value="other">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar transação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}