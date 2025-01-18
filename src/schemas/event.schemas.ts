import { EventFormat } from "@prisma/client";
import e from "express";
import z from "zod";

export const TicketSchema = z.object({
  name: z.string().trim().min(1, "Ticket name is required."),
  description: z.string().trim().min(1, "Ticket description is required."),
  quantity: z.number().int().gte(0, "Invalid quantity"),
  price: z.number().gt(0, "Invalid price"),
});

export const CreateTicketSchema = z.object({
  tickets: z.array(TicketSchema).nonempty("At least one ticket is required."),
});

export const CreateEventSchema = z.object({
  name: z.string().trim().min(1, "Event name is required."),
  description: z.string().trim().min(1, "Event description is required."),
  image: z.string().trim().min(1, "Event image is required."),
  tos: z.string().trim().min(1, "Event terms of service is required."),
  venue: z.string().trim().min(1, "Venue name is required."),
  address: z.string().trim().min(1, "Address is required."),
  lat: z.string().trim().min(1, "Latitude is required."),
  lng: z.string().trim().min(1, "Longitude  is required."),
  facebook: z.string().optional(),
  Format: z.enum([EventFormat.ONLINE, EventFormat.PHYSICAL]),
  instagram: z.string().optional(),
  startTime: z.preprocess((val) => new Date(val as string), z.date()),
  endTime: z.preprocess((val) => new Date(val as string), z.date()),
  startDate: z.preprocess((val) => new Date(val as string), z.date()),
  endDate: z.preprocess((val) => new Date(val as string), z.date()),
  category: z.array(z.string()).nonempty("At least one category is required"),
});

export const CreateCategorySchema = z.object({
  name: z.array(z.string()).nonempty("At least one category name is requred."),
});
