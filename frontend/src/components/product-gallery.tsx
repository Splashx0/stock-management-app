"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";

type ProductGalleryProps = {
  productName: string;
  productImage: string;
};

export function ProductGallery({
  productName,
  productImage,
}: ProductGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="h-10 w-10 relative rounded-md overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={productImage || "/placeholder.svg?height=40&width=40"}
          alt={productName}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
          <ZoomIn className="h-5 w-5 text-white" />
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{productName}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[60vh] mt-4">
            <img
              src={productImage || "/placeholder.svg?height=600&width=600"}
              alt={productName}
              className="object-contain w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
