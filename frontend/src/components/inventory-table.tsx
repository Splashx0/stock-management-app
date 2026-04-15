"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Edit, FileDown, Trash } from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { ProductGallery } from "./product-gallery";
import { EditProductModal } from "./edit-product-modal";
import { DeleteProductAlert } from "./delete-product-alert";

const products = [
  {
    id: "PRD-001",
    name: "Wireless Headphones",
    category: "Electronics",
    price: "$129.99",
    stock: 45,
    status: "In Stock",
    image: "/products/headphones.jpg",
  },
  {
    id: "PRD-002",
    name: "Cotton T-Shirt",
    category: "Clothing",
    price: "$24.99",
    stock: 120,
    status: "In Stock",
    image: "/products/tshirt.jpg",
  },
  {
    id: "PRD-003",
    name: "Smart Watch",
    category: "Electronics",
    price: "$199.99",
    stock: 8,
    status: "Low Stock",
    image: "/products/smartwatch.jpg",
  },
  {
    id: "PRD-004",
    name: "Desk Lamp",
    category: "Home",
    price: "$49.99",
    stock: 0,
    status: "Out of Stock",
    image: "/products/lamp.jpg",
  },
  {
    id: "PRD-005",
    name: "Running Shoes",
    category: "Sports",
    price: "$89.99",
    stock: 35,
    status: "In Stock",
    image: "/products/shoes.jpg",
  },
  {
    id: "PRD-006",
    name: "Coffee Maker",
    category: "Home",
    price: "$79.99",
    stock: 12,
    status: "In Stock",
    image: "/products/coffeemaker.jpg",
  },
  {
    id: "PRD-007",
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: "$59.99",
    stock: 5,
    status: "Low Stock",
    image: "/products/speaker.jpg",
  },
  {
    id: "PRD-008",
    name: "Denim Jeans",
    category: "Clothing",
    price: "$39.99",
    stock: 85,
    status: "In Stock",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "PRD-009",
    name: "Yoga Mat",
    category: "Sports",
    price: "$29.99",
    stock: 0,
    status: "Out of Stock",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "PRD-010",
    name: "Novel - Bestseller",
    category: "Books",
    price: "$19.99",
    stock: 28,
    status: "In Stock",
    image: "/placeholder.svg?height=80&width=80",
  },
];
export function InventoryTable() {
  const [inventory, setInventory] = useState(products);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string>("");

  const handleExportCSV = () => {
    exportToCSV(inventory, "inventory-data");
    toast({
      title: "Export successful",
      description: "Inventory data has been exported as CSV.",
    });
  };
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
        product.id === updatedProduct.id ? updatedProduct : product
      )
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
    <div>
      <div className="mb-4 flex justify-end">
        <Button variant="outline" onClick={handleExportCSV}>
          <FileDown className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      <div className="rounded-md border overflow-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>
                    <ProductGallery
                      productName={product.name}
                      productImage={product.image}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "In Stock"
                          ? "default"
                          : product.status === "Low Stock"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editProduct(product)}
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDeleteProduct(product.id)}
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
  );
}
