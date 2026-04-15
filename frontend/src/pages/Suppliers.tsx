import { Search } from "@/components/Search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building2, Edit, FileDown, Plus, Trash } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditSupplierModal } from "@/components/edit-supplier-modal";
import { DeleteSupplierAlert } from "@/components/delete-supplier-alert";
import { CreateSupplierModal } from "@/components/create-supplier-modal";
import { useToast } from "@/hooks/use-toast";

const intialSuppliers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "12345678",
    address: "Tunisia",
    products: 15,
    status: "Active",
  },
  {
    id: "2",
    name: "Sarah Doe",
    email: "sarah@example.com",
    phone: "12345678",
    address: "Tunisia",
    products: 28,
    status: "Active",
  },
  {
    id: "3",
    name: "Mike Doe",
    email: "mike@example.com",
    phone: "12345678",
    address: "Tunisia",
    products: 42,
    status: "Inactive",
  },
];
const status = ["All", "Active", "Inactive"];

export default function SuppliersPage() {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<any[]>(intialSuppliers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string>("");

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSupplierCreated = (newSupplier: any) => {
    console.log("Supplier created:", newSupplier);
    // Add the new supplier to the list
    setSuppliers((prev) => [newSupplier, ...prev]);
  };

  const editSupplier = (supplier: any) => {
    console.log("Edit supplier clicked:", supplier.id);
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleSupplierUpdated = (updatedSupplier: any) => {
    console.log("Updating supplier in list:", updatedSupplier.id);
    // Update the supplier in the list
    setSuppliers(
      suppliers.map((supplier) =>
        supplier.id === updatedSupplier.id ? updatedSupplier : supplier,
      ),
    );
    toast({
      title: "Supplier updated",
      description: `Supplier ${updatedSupplier.id} has been updated successfully.`,
    });
  };

  const handleDeleteSupplier = (supplierId: string) => {
    // Remove the supplier from the list
    setSuppliers(suppliers.filter((supplier) => supplier.id !== supplierId));

    toast({
      title: "Supplier deleted",
      description: `Supplier ${supplierId} has been deleted successfully.`,
    });
  };

  const confirmDeleteSupplier = (supplierId: string) => {
    setSupplierToDelete(supplierId);
    setIsDeleteAlertOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-0">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
        </div>
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <Search
              placeholder="Search suppliers..."
              onSearch={(query) => setSearchQuery(query)}
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {status.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Supplier
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier ID</TableHead>
                <TableHead>Company or Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                      {supplier.name}
                    </div>
                  </TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>{supplier.products}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        supplier.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {supplier.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 ">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editSupplier(supplier)}
                        title="Edit Supplier"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDeleteSupplier(supplier.id)}
                        className="text-destructive hover:text-destructive"
                        title="Delete Supplier"
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
        <CreateSupplierModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSupplierCreated={handleSupplierCreated}
        />
        {/* Edit Supplier Modal */}
        <EditSupplierModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          supplier={selectedSupplier}
          onSupplierUpdated={handleSupplierUpdated}
        />

        {/* Delete Supplier Alert Dialog */}
        <DeleteSupplierAlert
          open={isDeleteAlertOpen}
          onOpenChange={setIsDeleteAlertOpen}
          supplierId={supplierToDelete}
          onConfirm={handleDeleteSupplier}
        />
      </div>
    </div>
  );
}
