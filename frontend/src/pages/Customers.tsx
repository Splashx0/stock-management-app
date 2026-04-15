import { useEffect, useState } from "react";
import { Search } from "@/components/Search";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, User, Edit, Trash, FileDown } from "lucide-react";
import { EditCustomerModal } from "@/components/edit-customer-modal";
import { useToast } from "@/hooks/use-toast";
import { CreateCustomerModal } from "@/components/create-customer-modal";
import { DeleteCustomerAlert } from "@/components/delete-customer-alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportToCSV } from "@/lib/utils";

const initialCustomers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    address: "Tunisia",
    phone: "12345678",
    orders: 5,
    status: "Active",
    totalSpent: 1245.99,
    lastOrder: "2023-04-01",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    address: "Tunisia",
    phone: "12345678",
    orders: 3,
    totalSpent: 789.5,
    status: "Active",
    lastOrder: "2023-04-02",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    address: "Tunisia",
    phone: "12345678",
    orders: 8,
    totalSpent: 2399.99,
    status: "Inactive",
    lastOrder: "2023-04-03",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    address: "Tunisia",
    phone: "12345678",
    orders: 10,
    totalSpent: 3250,
    status: "Inactive",
    lastOrder: "2024-04-03",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael@example.com",
    address: "Tunisia",
    phone: "12345678",
    orders: 12,
    totalSpent: 5000,
    status: "Active",
    lastOrder: "2024-04-03",
  },
];

const status = ["All", "Active", "Inactive"];

export default function CustomersPage() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<any[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || customer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCustomerCreated = (newCustomer: any) => {
    console.log("Customer created:", newCustomer);
    setCustomers((prev) => [newCustomer, ...prev]);
    toast({
      title: "Success",
      description: "Customer created successfully",
    });
  };

  const editCustomer = (customer: any) => {
    console.log("Edit customer clicked:", customer.id);
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleCustomerUpdated = (updatedCustomer: any) => {
    console.log("Updating customer in list:", updatedCustomer.id);
    setCustomers(
      customers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer,
      ),
    );
    toast({
      title: "Customer updated",
      description: `Customer has been updated successfully.`,
    });
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter((customer) => customer.id !== customerId));
    toast({
      title: "Customer deleted",
      description: `Customer has been deleted successfully.`,
    });
  };

  const confirmDeleteCustomer = (customerId: string) => {
    setCustomerToDelete(customerId);
    setIsDeleteAlertOpen(true);
  };

  const handleExportCSV = () => {
    exportToCSV(customers, "customers-data");
    toast({
      duration: 2000,
      variant: "default",
      title: "Export successful",
      description: "Customers data has been exported as CSV 🎉.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-0">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        </div>
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <Search
              placeholder="Search customers..."
              onSearch={(query) => setSearchQuery(query)}
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {status.map((stat) => (
                <SelectItem key={stat} value={stat}>
                  {stat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportCSV}>
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      {customer.name}
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.address || "-"}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>{customer.totalSpent.toFixed(2)} TND</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs text-center font-medium ${
                        customer.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customer.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editCustomer(customer)}
                        title="Edit Customer"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDeleteCustomer(customer.id)}
                        className="text-destructive hover:text-destructive"
                        title="Delete Customer"
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

        <CreateCustomerModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onCustomerCreated={handleCustomerCreated}
        />
        <EditCustomerModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          customer={selectedCustomer}
          onCustomerUpdated={handleCustomerUpdated}
        />
        <DeleteCustomerAlert
          open={isDeleteAlertOpen}
          onOpenChange={setIsDeleteAlertOpen}
          customerId={customerToDelete}
          onConfirm={handleDeleteCustomer}
        />
      </div>
    </div>
  );
}
