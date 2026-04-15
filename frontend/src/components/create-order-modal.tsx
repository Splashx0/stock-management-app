import { useState } from "react";
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
import { X, Plus, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Sample product data with images
const products = [
  {
    id: "1",
    name: "Fer num 6",
    stock: 10,
    price: 40,
    image:
      "https://vertjaune.com/wp-content/uploads/2023/06/fer-a-beton-diametre-6-botte-fer-6-1.jpg",
  },
  {
    id: "2",
    name: "Brique num 12",
    stock: 300,
    price: 2,
    image: "https://sqes.tn/cdn/shop/files/brique-12-trous_TUNISIE.png",
  },
  {
    id: "3",
    name: " Ciment CPA",
    stock: 500,
    price: 15,
    image:
      "https://www.carthagecement.com.tn/sites/default/files/2020-11/CEM-I-42-NSR.jpg",
  },
  {
    id: "4",
    name: "Acier galvanisé",
    stock: 0,
    price: 10,
    category: "Acier",
    image:
      "https://image.made-in-china.com/2f0j00nsITbBFtCapK/Steel-Building-Material-Hot-Dipped-Galvanized-Steel.webp",
  },
  {
    id: "5",
    name: "Porte d'entrée",
    stock: 30,
    price: 1200,
    image:
      "https://meubletunisie.tn/wp-content/uploads/2023/02/Porte-exterieur-promotion.jpg",
  },
];

// Sample customers
const customers = [
  { id: "CUST-001", name: "John Doe" },
  { id: "CUST-002", name: "Jane Smith" },
  { id: "CUST-003", name: "Robert Johnson" },
  { id: "CUST-004", name: "Emily Davis" },
  { id: "CUST-005", name: "Michael Wilson" },
];

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CreateOrderModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated?: (order: any) => void;
};

export function CreateOrderModal({
  open,
  onOpenChange,
  onOrderCreated,
}: CreateOrderModalProps) {
  const { toast } = useToast();
  const [customerId, setCustomerId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const addProductToOrder = (product: (typeof products)[0]) => {
    // Check if product already exists in order
    const existingItemIndex = orderItems.findIndex(
      (item) => item.productId === product.id,
    );

    if (existingItemIndex >= 0) {
      // Update quantity if product already in order
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += 1;
      setOrderItems(updatedItems);
    } else {
      // Add new product to order
      setOrderItems([
        ...orderItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ]);
    }
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;

    const updatedItems = [...orderItems];
    updatedItems[index].quantity = quantity;
    setOrderItems(updatedItems);
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    return orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax rate
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = () => {
    if (!customerId) {
      toast({
        title: "Error",
        description: "Please select a customer",
      });
      return;
    }

    if (orderItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product to the order",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const order = {
        id: `ORD-${Math.floor(Math.random() * 1000)}`,
        customerId,
        customerName: customers.find((c) => c.id === customerId)?.name,
        items: orderItems,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
        date: new Date().toISOString(),
        status: "Pending",
      };

      if (onOrderCreated) {
        onOrderCreated(order);
      }

      toast({
        title: "Order created",
        description: `Order ${order.id} has been created successfully.`,
      });

      // Reset form
      setCustomerId("");
      setOrderItems([]);
      setSearchQuery("");
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Add products to create a new customer order.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 ">
          {/* Left side - Product selection */}
          <div className="flex flex-col">
            <div className="mb-4">
              <Label htmlFor="customer">Customer</Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Label htmlFor="search-products">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-products"
                  placeholder="Search by name or ID..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Label>Available Products</Label>
            <div
              className="mt-2
            border rounded-md flex-2
            h-[300px] flex flex-col"
            >
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3 ">
                  {filteredProducts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No products found
                    </p>
                  ) : (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center p-2 border rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => addProductToOrder(product)}
                      >
                        <div className="h-12 w-12 relative rounded-md overflow-hidden flex-shrink-0 bg-muted">
                          <img
                            src={
                              product.image ||
                              "/placeholder.svg?height=48&width=48"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="font-medium">{product.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{product.id}</span>
                            <span>${product.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              product.stock > 10
                                ? "default"
                                : product.stock > 0
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : "Out of stock"}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Right side - Order summary */}
          <div className="flex flex-col">
            <h3 className="font-medium mb-2">Order Items</h3>
            <div
              className="border rounded-md flex-2
            h-[450px] overflow-hidden  flex flex-col"
            >
              {orderItems.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No items added to order
                </div>
              ) : (
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-3">
                    {orderItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 border rounded-md"
                      >
                        <div className="h-10 w-10 relative rounded-md overflow-hidden flex-shrink-0 bg-muted">
                          <img
                            src={
                              item.image ||
                              "/placeholder.svg?height=40&width=40"
                            }
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-r-none"
                              onClick={() =>
                                updateItemQuantity(index, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItemQuantity(
                                  index,
                                  Number.parseInt(e.target.value) || 1,
                                )
                              }
                              className="h-8 w-14 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-l-none"
                              onClick={() =>
                                updateItemQuantity(index, item.quantity + 1)
                              }
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {orderItems.length > 0 && (
                <div className="border-t p-4  space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (10%)</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
