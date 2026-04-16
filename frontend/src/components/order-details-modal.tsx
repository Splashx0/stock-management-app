import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PrintInvoice } from "./print-invoice";
import { Printer } from "lucide-react";

import { cn } from "@/lib/utils";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type Order = {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
};

type OrderDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null | any;
};

// Company information for the invoice
const companyInfo = {
  name: "StockSync Inc.",
  address: "123 Inventory Lane, Warehouse District, NY 10001",
  phone: "+1 (555) 123-4567",
  email: "invoices@stocksync.com",
  website: "www.stocksync.com",
};

export function OrderDetailsModal({
  open,
  onOpenChange,
  order,
}: OrderDetailsModalProps) {
  const [, setIsPrinting] = useState(false);
  const printInvoiceRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  const handlePrint = () => {
    setIsPrinting(true);

    // Use setTimeout to ensure the print dialog opens after state update
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  return (
    <>
      {console.log(order)}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Order Details - {order.id}</DialogTitle>
            <DialogDescription>
              View complete order information
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Customer
                </p>
                <p>{order.customer}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date
                </p>
                <p>{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <div
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    {
                      "bg-green-100 text-green-800":
                        order.status === "Delivered",
                      "bg-yellow-100 text-yellow-800":
                        order.status === "Pending",
                      "bg-blue-100 text-blue-800": order.status === "Shipped",
                      "bg-red-100 text-red-800": order.status === "Canceled",
                    },
                  )}
                >
                  {order.status}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total
                </p>
                <p className="font-medium">{order?.total?.toFixed(2)} TND</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Order Items</h3>
              <ScrollArea className="h-[300px] border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item: any, index: any) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-10 w-10 relative rounded-md overflow-hidden flex-shrink-0 bg-muted mr-3">
                              <img
                                src={
                                  item.image ||
                                  "/placeholder.svg?height=40&width=40"
                                }
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.productId}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.price.toFixed(2)} TND</TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {(item.price * item.quantity).toFixed(2)} TND
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            <div className="border rounded-md p-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{order.subtotal.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{order.tax.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{order.total.toFixed(2)} TND</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden invoice for printing */}
      <div className="print:block hidden">
        <PrintInvoice
          ref={printInvoiceRef}
          order={order}
          companyInfo={companyInfo}
        />
      </div>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
