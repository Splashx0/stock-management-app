"use client";

import type React from "react";

import { useState, useRef } from "react";
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
import { useToast } from "@/hooks/use-toast";

// Dummy data
const suppliers = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Sarah Doe" },
  { id: "3", name: "Mike Doe" },
];

const categories = [
  { id: "Fer", name: "Fer" },
  { id: "Ciment", name: "Ciment" },
  { id: "Acier", name: "Acier" },
  { id: "Porte", name: "Porte" },
  { id: "Brique", name: "Brique" },
];

type CreateProductModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductCreated?: (product: any) => void;
};

export function CreateProductModal({
  open,
  onOpenChange,
  onProductCreated,
}: CreateProductModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    supplier: "", // ✅ added
    price: "",
    quantity: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    category: "",
    supplier: "", // ✅ added
    price: "",
    quantity: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productImage, setProductImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFormData({
        name: "",
        category: "",
        supplier: "",
        price: "",
        quantity: "",
      });
      setProductImage("");
      setErrors({
        name: "",
        category: "",
        supplier: "",
        price: "",
        quantity: "",
      });
    }
    onOpenChange(open);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProductImage(imageUrl);
      toast({
        title: "Image uploaded",
        description: "Product image has been uploaded.",
      });
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } },
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      category: "",
      supplier: "",
      price: "",
      quantity: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
      isValid = false;
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (!formData.supplier) {
      newErrors.supplier = "Supplier is required";
      isValid = false;
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
      isValid = false;
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = "Price must be a valid positive number";
      isValid = false;
    }

    if (!formData.quantity) {
      newErrors.quantity = "Stock quantity is required";
      isValid = false;
    } else if (
      isNaN(Number(formData.quantity)) ||
      Number(formData.quantity) < 0
    ) {
      newErrors.quantity = "Stock must be a valid positive number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const stockNum = Number(formData.quantity);
        let status = "IN_STOCK";
        if (stockNum <= 0) {
          status = "OUT_OF_STOCK";
        } else if (stockNum <= 10) {
          status = "LOW_STOCK";
        }

        const formattedPrice = Number(formData.price);

        const product = {
          id: `PRD-${Math.floor(Math.random() * 1000)}`,
          name: formData.name,
          category: formData.category,
          supplier: formData.supplier,
          price: formattedPrice,
          quantity: stockNum,
          status,
          image: productImage || "/placeholder.svg?height=80&width=80",
        };

        onProductCreated?.(product);

        toast({
          title: "Product created",
          description: `Product ${product.id} has been created successfully.`,
        });

        handleOpenChange(false);
      } catch (error) {
        console.error("Error creating product:", error);
        toast({
          title: "Error",
          description:
            "An error occurred while creating the product. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Enter product details to add to inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-20 w-20 relative rounded-md overflow-hidden flex-shrink-0 bg-muted">
              <img
                src={productImage || "/placeholder.svg?height=80&width=80"}
                alt="Product image"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <Button variant="outline" size="sm" onClick={handleImageUpload}>
                Upload Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recommended size: 400x400px
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier</Label>
            <Select
              value={formData.supplier}
              onValueChange={(value) => handleSelectChange("supplier", value)}
            >
              <SelectTrigger id="supplier">
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.name}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.supplier && (
              <p className="text-sm text-destructive">{errors.supplier}</p>
            )}
          </div>

          <div className="space-y-2">
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
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (TND)</Label>
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
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Stock Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">{errors.quantity}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
