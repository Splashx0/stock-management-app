import { Request, Response } from "express";
import { prisma } from "../server.js";

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      include: { orders: true },
    });
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { orders: true },
    });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, address, phone } = req.body;

    const customer = await prisma.customer.create({
      data: {
        email,
        firstName,
        lastName,
        address,
        phone,
      },
    });
    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create customer" });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update customer" });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    await prisma.customer.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete customer" });
  }
};
