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
import { Package, Plus, Edit, FileDown, Trash, Eye } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportToCSV } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ProductGallery } from "@/components/product-gallery";
import { CreateProductModal } from "@/components/create-product-modal";
import { EditProductModal } from "@/components/edit-product-modal";
import { DeleteProductAlert } from "@/components/delete-product-alert";

const inventory1 = [
  {
    id: "1",
    name: "Fer num 6",
    supplier: "John Doe",
    quantity: 10,
    price: 40,
    category: "Fer",
    status: "LOW_STOCK",
    image:
      "https://vertjaune.com/wp-content/uploads/2023/06/fer-a-beton-diametre-6-botte-fer-6-1.jpg",
  },
  {
    id: "2",
    name: "Brique num 12",
    supplier: "John Doe",
    quantity: 300,
    price: 2,
    category: "Brique",
    status: "IN_STOCK",
    image: "https://sqes.tn/cdn/shop/files/brique-12-trous_TUNISIE.png",
  },
  {
    id: "3",
    name: " Ciment CPA",
    supplier: "John Doe",
    quantity: 500,
    price: 15,
    category: "Ciment",
    status: "IN_STOCK",
    image:
      "https://www.carthagecement.com.tn/sites/default/files/2020-11/CEM-I-42-NSR.jpg",
  },
  {
    id: "4",
    name: "Acier galvanisé",
    supplier: "John Doe",
    quantity: 0,
    price: 10,
    category: "Acier",
    status: "OUT_OF_STOCK",
    image:
      "https://image.made-in-china.com/2f0j00nsITbBFtCapK/Steel-Building-Material-Hot-Dipped-Galvanized-Steel.webp",
  },
  {
    id: "5",
    name: "Porte d'entrée",
    supplier: "John Doe",
    quantity: 30,
    price: 1200,
    category: "Porte",
    status: "IN_STOCK",
    image:
      "https://meubletunisie.tn/wp-content/uploads/2023/02/Porte-exterieur-promotion.jpg",
  },
];

const categories = ["All", "Fer", "Brique", "Porte", "Ciment", "Acier"];

export default function InventoryPage() {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<any[]>(inventory1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const handleExportCSV = () => {
    exportToCSV(inventory, "inventory-data");
    toast({
      duration: 2000,
      variant: "default",
      title: "Export successful",
      description: "Inventory data has been exported as CSV 🎉.",
    });
  };

  const handleProductCreated = (newProduct: any) => {
    console.log("Product created:", newProduct);
    setInventory((prev) => [newProduct, ...prev]);
    toast({
      title: "Success",
      description: "Product created successfully",
    });
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    // ||  item.ref.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const editProduct = (product: any) => {
    console.log("Edit product clicked:", product.id);
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleProductUpdated = (updatedProduct: any) => {
    console.log("Updating product in list:", updatedProduct.id);
    // Update the product in the list
    setInventory(
      inventory.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
    toast({
      title: "Product updated",
      description: `Product ${updatedProduct.id} has been updated successfully.`,
    });
  };

  const confirmDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    // Remove the product from the list
    setInventory(inventory.filter((product) => product.id !== productId));

    toast({
      title: "Product deleted",
      description: `Product ${productId} has been deleted successfully.`,
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-0">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        </div>
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <Search
              placeholder="Search products..."
              onSearch={(query) => setSearchQuery(query)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportCSV}>
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => setShowAddProduct(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
          <CreateProductModal
            open={showAddProduct}
            onOpenChange={setShowAddProduct}
            onProductCreated={handleProductCreated}
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Product ID</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="px-[40px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <ProductGallery
                      productName={item.name}
                      productImage={item.image}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell>{item.supplier || "John Doe"}</TableCell>
                  <TableCell>{item.category || "N/A"}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{Number(item.price).toFixed(2)} TND</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.status === "IN_STOCK"
                          ? "bg-green-100 text-green-800"
                          : item.status === "LOW_STOCK"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status === "IN_STOCK"
                        ? "In Stock"
                        : item.status === "LOW_STOCK"
                          ? "Low Stock"
                          : "Out of Stock"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editProduct(item)}
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDeleteProduct(item.id)}
                        className="text-destructive hover:text-destructive"
                        title="Delete Product"
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
        <EditProductModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          product={selectedProduct}
          onProductUpdated={handleProductUpdated}
        />

        {/* Delete Product Alert Dialog */}
        <DeleteProductAlert
          open={isDeleteAlertOpen}
          onOpenChange={setIsDeleteAlertOpen}
          productId={productToDelete}
          onConfirm={handleDeleteProduct}
        />
      </div>
    </div>
  );
}
