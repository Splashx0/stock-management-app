"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Product categories
const categories = [
  { id: "Fer", name: "Fer" },
  { id: "Ciment", name: "Ciment" },
  { id: "Acier", name: "Home" },
  { id: "Porte", name: "Porte" },
  { id: "Brique", name: "Brique" },
];

type Product = {
  id: string;
  name: string;
  category: string;
  price: string | number;
  quantity: number;
  status: string;
  image?: string;
  supplier?: string;
};

type EditProductModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onProductUpdated?: (updatedProduct: Product) => void;
};

export function EditProductModal({
  open,
  onOpenChange,
  product,
  onProductUpdated,
}: EditProductModalProps) {
  const [formData, setFormData] = useState<Product>({
    id: "",
    name: "",
    category: "",
    price: "",
    quantity: 0,
    status: "",
    supplier: "John Doe",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to a server
      // For this demo, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));

      toast({
        title: "Image uploaded",
        description: "Product image has been updated.",
      });
    }
  };

  // Initialize form with product data when it changes
  useEffect(() => {
    if (product) {
      console.log("Initializing edit form with product:", product);
      setFormData({
        ...product,
        // Convert price from string with $ to string without $
        //   price: product.price.replace("$", ""),
      });
    }
  }, [product]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string | number } },
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateStatus = (quantity: number) => {
    if (quantity <= 0) return "OUT_OF_STOCK";
    if (quantity <= 10) return "LOW_STOCK";
    return "IN_STOCK";
  };

  const handleSubmit = () => {
    if (!product) {
      console.error("No product to update");
      return;
    }

    if (!formData.name || !formData.category || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmitting(true);
    console.log("Updating product:", product.id);

    // Simulate API call
    setTimeout(() => {
      // Update status based on stock level
      const status = updateStatus(Number(formData.quantity));

      const updatedProduct: Product = {
        ...formData,
        price: Number.parseFloat(String(formData.price)).toFixed(2),
        status,
      };

      console.log("Updated product data:", updatedProduct);

      if (onProductUpdated) {
        onProductUpdated(updatedProduct);
      }

      toast({
        title: "Product updated",
        description: `Product ${product.id} has been updated successfully.`,
      });

      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Product - {product.id}</DialogTitle>
          <DialogDescription>
            Modify product details and inventory information.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 relative rounded-md overflow-hidden flex-shrink-0 bg-muted">
                <img
                  src={formData.image || "/placeholder.svg?height=80&width=80"}
                  alt={formData.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-medium">{product.id}</h3>
                <p className="text-sm text-muted-foreground">
                  Product ID cannot be changed
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={handleImageUpload}
                >
                  Change Image
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger id="status" disabled>
                  <SelectValue placeholder="Status is determined by stock level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Status is automatically determined by stock level
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
