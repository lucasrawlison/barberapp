import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface Type {
  id: string
  name: string
  value: number
}
interface Service {
  id: string;
  code: number;
  value: number;
  customer: Customer | null;
  servicesValue: number;
  discount: number;
  createdAt: Date;
  servicesTypes: Type[];
  userId: string;
  user: User | undefined;
  paymentMethodId: string
  customerId: string;
  paymentMethod: PaymentMethod | null
  transactions: Transaction[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  code: string;

}

interface Transaction {
  description: string;
  service: Service | null
  value: number;
  date: string;
  type: string;
  category: string;
  paymentMethodId: string;
  paymentMethod: PaymentMethod;
}

interface Transaction {
  description: string;
  service: Service | null
  value: number;
  date: string;
  type: string;
  category: string;
  paymentMethodId: string;
  paymentMethod: PaymentMethod;
}

interface PaymentMethod {
  id: string;
  name: string;
  bankId: string;
  bankAccount: BankAccount;
  transactions: Transaction[];
}


interface BankAccount {
  id: string;
  bankName: string;
  initialValue: number;
  agency: string;
  accountNumber: string;
  accountType: string;
  accountOwner: string;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
}

interface PaymentMethod {
  id: string;
  name: string;
  bankId: string;
  bankAccount: BankAccount;
  transactions: Transaction[];
}


interface User {
  id: string;
  name: string;
  email: string;
  login: string;
  profileType: string;
  profileImgLink: string;
}

interface BankInfoProps {
    banks: BankAccount[];
    isLoadingBanks: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  bankId: string;
  bankAccount: BankAccount;
  transactions: Transaction[];
}

export function BanksInfo ({ banks, isLoadingBanks }:BankInfoProps) {


    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(price)
      }


    return (
      <div className="space-y-4">
        {banks.map((bank, i) => (
          <div className="flex flex-col gap-4" key={i}>
            <Label className="text-base">{bank.bankName}</Label>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Em conta</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row justify-between items-center">
                  <span className="text-2xl font-bold">
                    {isLoadingBanks ? (
                      <Skeleton key={1} className="w-52 h-4 mb-4" />
                    ) : (
                        bank.transactions ? (

                            formatPrice(
                              bank.transactions.reduce((acc, transaction) => {
                                return transaction.type === "Receita" || transaction.type === "Depósito"
                                  ? acc + transaction.value
                                  : acc;
                              }, bank.initialValue) -
                                bank.transactions.reduce((acc, transaction) => {
                                  return transaction.type === "Despesa"
                                    ? acc + transaction.value
                                    : acc;
                                }, 0)
                            )
                        ) : (
                           formatPrice(0)
                        )
                    )}
                    
                  </span>
                  <div className="flex itens-center">
                    <ul>
                        {bank.paymentMethods.map((paymentMethod, i) => (
                            <li className="text-xs text-primary/70" key={i}>
                                
                                {paymentMethod.name}</li>
                        ))}
                    </ul>
                  </div>
                  {/* {isLoadingBanks ? (
                  <Skeleton key={2} className="w-52 h-2 mb-4" />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {" "}
                    + 12% que o último mês{" "}
                  </p>
                )} */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ganhos gerais</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row justify-between items-center">
                  <span className="text-2xl font-bold">
                    {isLoadingBanks ? (
                      <Skeleton key={1} className="w-52 h-4 mb-4" />
                    ) : (
                        bank.transactions && (

                            formatPrice(
                              bank.transactions.reduce((acc, transaction) => {
                                return transaction.type === "Receita"
                                  ? acc + transaction.value
                                  : acc;
                              }, 0) 
                            )
                        )
                    )}
                    
                  </span>
                  
                  {/* {isLoadingBanks ? (
                  <Skeleton key={2} className="w-52 h-2 mb-4" />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {" "}
                    + 12% que o último mês{" "}
                  </p>
                )} */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gastos gerais</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row justify-between items-center">
                  <span className="text-2xl font-bold">
                    {isLoadingBanks ? (
                      <Skeleton key={1} className="w-52 h-4 mb-4" />
                    ) : (
                        bank.transactions && (

                            formatPrice(
                              bank.transactions.reduce((acc, transaction) => {
                                return transaction.type === "Despesa"
                                  ? acc + transaction.value
                                  : acc;
                              }, 0) 
                            )
                        )
                    )}
                    
                  </span>
                  
                  {/* {isLoadingBanks ? (
                  <Skeleton key={2} className="w-52 h-2 mb-4" />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {" "}
                    + 12% que o último mês{" "}
                  </p>
                )} */}
                </CardContent>
              </Card>
            </div>
            <Separator className="mt-4" />
          </div>
        ))}
      </div>
    );
}