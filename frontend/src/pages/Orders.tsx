import { Search } from "@/components/Search";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileDown,
  Plus,
  Calendar as CalendarIcon,
  Edit,
  Eye,
  Trash,
} from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { exportToCSV } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { OrderDetailsModal } from "@/components/order-details-modal";
import { CreateOrderModal } from "@/components/create-order-modal";
import { DeleteOrderAlert } from "@/components/delete-order-alert";
import { EditOrderModal } from "@/components/edit-order-modal";
const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: "2023-04-01",
    items: [
      {
        id: "1",
        name: "Fer num 6",
        quantity: 2,
        price: 40,
        image:
          "https://vertjaune.com/wp-content/uploads/2023/06/fer-a-beton-diametre-6-botte-fer-6-1.jpg",
      },
      {
        id: "2",
        name: "Brique num 12",
        quantity: 150,
        price: 2,
        image: "https://sqes.tn/cdn/shop/files/brique-12-trous_TUNISIE.png",
      },
    ],
    subtotal: 380.0,
    tax: 38.0,
    total: 418.0,
    Payment: "Paid",
    status: "Delivered",
  },
  {
    id: "ORD-001",
    customer: "Jane Smith",
    date: "2023-04-02",
    items: [
      {
        productId: "1",
        name: "Fer num 6",
        price: 40,
        quantity: 5,
        image:
          "https://vertjaune.com/wp-content/uploads/2023/06/fer-a-beton-diametre-6-botte-fer-6-1.jpg",
      },
      {
        productId: "2",
        name: "Brique num 12",
        price: 2,
        quantity: 50,
        image: "https://sqes.tn/cdn/shop/files/brique-12-trous_TUNISIE.png",
      },
    ],
    subtotal: 40 * 5 + 2 * 50, // 200 + 100 = 300
    tax: 30,
    total: 330,
    Payment: "Paid",
    status: "Pending",
  },
  {
    id: "ORD-002",
    customer: "Robert Johnson",
    date: "2023-04-03",
    items: [
      {
        productId: "3",
        name: "Ciment CPA",
        price: 15,
        quantity: 10,
        image:
          "https://www.carthagecement.com.tn/sites/default/files/2020-11/CEM-I-42-NSR.jpg",
      },
      {
        productId: "4",
        name: "Acier galvanisé",
        price: 10,
        quantity: 2,
        image:
          "https://image.made-in-china.com/2f0j00nsITbBFtCapK/Steel-Building-Material-Hot-Dipped-Galvanized-Steel.webp",
      },
    ],
    subtotal: 15 * 10 + 10 * 2, // 150 + 20 = 170
    tax: 17,
    total: 187,
    Payment: "Paid",
    status: "Canceled",
  },
  {
    id: "ORD-003",
    customer: "Emily Davis",
    date: "2023-04-04",
    items: [
      {
        productId: "5",
        name: "Porte d'entrée",
        price: 1200,
        quantity: 1,
        image:
          "https://meubletunisie.tn/wp-content/uploads/2023/02/Porte-exterieur-promotion.jpg",
      },
      {
        productId: "2",
        name: "Brique num 12",
        price: 2,
        quantity: 20,
        image: "https://sqes.tn/cdn/shop/files/brique-12-trous_TUNISIE.png",
      },
    ],
    subtotal: 1200 * 1 + 2 * 20, // 1200 + 40 = 1240
    tax: 124,
    total: 1364,
    Payment: "Paid",
    status: "Pending",
  },
  {
    id: "ORD-004",
    customer: "Michael Wilson",
    date: "2023-04-05",
    items: [
      {
        productId: "3",
        name: "Ciment CPA",
        price: 15,
        quantity: 20,
        image:
          "https://www.carthagecement.com.tn/sites/default/files/2020-11/CEM-I-42-NSR.jpg",
      },
    ],
    subtotal: 15 * 20, // 300
    tax: 30,
    total: 330,
    Payment: "Paid",
    status: "Delivered",
  },
];

export default function OrdersPage() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [ordersList, setOrdersList] = useState(orders);
  const [showEditOrder, setShowEditOrder] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string>("");
  const handleEditOrder = (e: any) => {
    e.preventDefault();
    setShowEditOrder(false);
    setSelectedOrder(null);
  };

  const viewOrderDetails = (order: (typeof orders)[0]) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };
  const editOrder = (order: (typeof orders)[0]) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleOrderUpdated = (updatedOrder: (typeof orders)[0]) => {
    // Update the order in the list
    setOrdersList(
      ordersList.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      ),
    );
  };

  const confirmDeleteOrder = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrdersList(ordersList.filter((order) => order.id !== orderId));

    toast({
      title: "Order deleted",
      description: `Order ${orderId} has been deleted successfully.`,
    });
  };
  const handleExportCSV = () => {
    exportToCSV(orders, "orders-data");
    toast({
      duration: 2000,
      variant: "default",
      title: "Export successful",
      description: "Orders data has been exported as CSV 🎉.",
    });
  };

  const filteredOrders = ordersList.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-0">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        </div>
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <Search
              placeholder="Search orders..."
              onSearch={(query) => setSearchQuery(query)}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select onValueChange={setStatusFilter} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportCSV}>
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Order
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pl-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.items.length}</Badge>
                  </TableCell>{" "}
                  <TableCell>{order.total.toFixed(2)} TND</TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        {
                          "bg-green-100 text-green-800":
                            order.Payment === "Paid",
                          "bg-yellow-100 text-yellow-800":
                            order.Payment === "Pending",
                        },
                      )}
                    >
                      {order.Payment}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        {
                          "bg-green-100 text-green-800":
                            order.status === "Delivered",
                          "bg-yellow-100 text-yellow-800":
                            order.status === "Pending",
                          "bg-blue-100 text-blue-800":
                            order.status === "Shipped",
                          "bg-red-100 text-red-800":
                            order.status === "Canceled",
                        },
                      )}
                    >
                      {order.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 ">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => viewOrderDetails(order)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editOrder(order)}
                        title="Edit Order"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDeleteOrder(order.id)}
                        className="text-destructive hover:text-destructive"
                        title="Delete Order"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <OrderDetailsModal
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          order={selectedOrder}
        />
        <EditOrderModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          order={selectedOrder}
          onOrderUpdated={handleOrderUpdated as any}
        />
        <DeleteOrderAlert
          open={isDeleteAlertOpen}
          onOpenChange={setIsDeleteAlertOpen}
          orderId={orderToDelete}
          onConfirm={handleDeleteOrder}
        />

        <CreateOrderModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onOrderCreated={(order) => {
            const newOrder = {
              ...order,
              date: new Date(order.date).toLocaleDateString(),
              customer: order.customerName,
            };
            setOrdersList([...ordersList, newOrder]);
            toast({
              title: "Success",
              description: "Order created successfully",
            });
          }}
        />
      </div>
    </div>
  );
}
