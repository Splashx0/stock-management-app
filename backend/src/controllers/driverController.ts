import { Request, Response } from "express";
import { prisma } from "../server.js";

export const getAllDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await prisma.driver.findMany();
    res.json(drivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
};

export const getDriverById = async (req: Request, res: Response) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.json(driver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch driver" });
  }
};

export const createDriver = async (req: Request, res: Response) => {
  try {
    const { name, phone, address, image } = req.body;

    const driver = await prisma.driver.create({
      data: {
        name,
        phone,
        address,
        image,
      },
    });
    res.status(201).json(driver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create driver" });
  }
};

export const updateDriver = async (req: Request, res: Response) => {
  try {
    const driver = await prisma.driver.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(driver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update driver" });
  }
};

export const deleteDriver = async (req: Request, res: Response) => {
  try {
    await prisma.driver.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete driver" });
  }
};
