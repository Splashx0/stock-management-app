import { Request, Response } from "express";
import { prisma } from "../server.js";

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { customer: true, orderItems: { include: { product: true } } },
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { customer: true, orderItems: { include: { product: true } } },
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerId, orderItems, status, priceTotal } = req.body;

    const order = await prisma.order.create({
      data: {
        customerId,
        status: status || "PENDING",
        priceTotal,
        orderItems: {
          create: orderItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { customer: true, orderItems: { include: { product: true } } },
    });
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { orderItems, ...rest } = req.body;

    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...rest,
        ...(orderItems && {
          orderItems: {
            deleteMany: {},
            create: orderItems.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        }),
      },
      include: { customer: true, orderItems: { include: { product: true } } },
    });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update order" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await prisma.order.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};
