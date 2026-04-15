import React from "react";
import { formatDate } from "@/lib/utils";

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

type PrintInvoiceProps = {
  order: Order;
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo?: string;
  };
};

export const PrintInvoice = React.forwardRef<HTMLDivElement, PrintInvoiceProps>(
  ({ order, companyInfo }, ref) => {
    return (
      <div
        ref={ref}
        className="p-8 bg-white text-black max-w-4xl mx-auto hidden print:block"
      >
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            {companyInfo.logo ? (
              <img
                src={companyInfo.logo || "/placeholder.svg"}
                alt={companyInfo.name}
                className="h-16 mb-2"
              />
            ) : (
              <h1 className="text-2xl font-bold">{companyInfo.name}</h1>
            )}
            <div className="text-sm">
              <p>{companyInfo.address}</p>
              <p>{companyInfo.phone}</p>
              <p>{companyInfo.email}</p>
              <p>{companyInfo.website}</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold mb-2">INVOICE</h1>
            <div className="text-sm">
              <p>
                <span className="font-semibold">Invoice #:</span> {order.id}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {formatDate(order.date)}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {order.status}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
          <div className="text-sm">
            <p className="font-medium">{order.customerName}</p>
            <p>Customer ID: {order.customerId}</p>
          </div>
        </div>

        {/* Order Items */}
        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="py-2 text-left">Item</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Quantity</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3">
                  <div className="flex items-center">
                    <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-100 mr-3">
                      <img
                        src={
                          item.image || "/placeholder.svg?height=40&width=40"
                        }
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-600">{item.productId}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Order Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Tax:</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Information & Terms */}
        <div className="text-sm mb-8">
          <h2 className="text-lg font-semibold mb-2">Payment Information</h2>
          <p>Please make payment within 30 days of invoice date.</p>
          <p>Bank: National Bank</p>
          <p>Account: 1234567890</p>
          <p>Routing: 987654321</p>
        </div>

        {/* Thank You Note */}
        <div className="text-center text-sm mt-12">
          <p>Thank you for your business!</p>
        </div>
      </div>
    );
  }
);

PrintInvoice.displayName = "PrintInvoice";
