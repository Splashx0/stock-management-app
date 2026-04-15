import type React from "react";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";

type Supplier = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  products: number;
};

type EditSupplierModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
  onSupplierUpdated?: (updatedSupplier: Supplier) => void;
};

export function EditSupplierModal({
  open,
  onOpenChange,
  supplier,
  onSupplierUpdated,
}: EditSupplierModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Supplier>({
    id: "",
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    status: "",
    products: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
  });

  // Initialize form with supplier data when it changes
  useEffect(() => {
    if (supplier) {
      console.log("Initializing edit form with supplier:", supplier);
      setFormData({
        ...supplier,
      });
    }
  }, [supplier]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number } },
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user selects
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!supplier) {
      console.error("No supplier to update");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    console.log("Updating supplier:", supplier.id);

    // Simulate API call
    setTimeout(() => {
      try {
        const updatedSupplier: Supplier = {
          ...formData,
        };

        console.log("Updated supplier data:", updatedSupplier);

        if (onSupplierUpdated) {
          onSupplierUpdated(updatedSupplier);
        }

        toast({
          title: "Supplier updated",
          description: `Supplier ${supplier.id} has been updated successfully.`,
        });

        setIsSubmitting(false);
        onOpenChange(false);
      } catch (error) {
        console.error("Error updating supplier:", error);
        toast({
          title: "Error",
          description:
            "An error occurred while updating the supplier. Please try again.",
        });
        setIsSubmitting(false);
      }
    }, 1000);
  };

  if (!supplier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Supplier - {supplier.id}</DialogTitle>
          <DialogDescription>
            Modify supplier details and contact information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company or Person Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company or person name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@supplier.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter supplier address"
              rows={3}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Supplier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
