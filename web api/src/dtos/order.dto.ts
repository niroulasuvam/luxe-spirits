import { z } from "zod";

export const CreateOrderDTO = z.object({
  paymentMethod: z.enum(["esewa", "mobile-banking"], {
    message: "Choose eSewa or mobile banking"
  }),
  billingName: z.string().min(2, "Billing name is required"),
  paymentReference: z.string().min(3, "Payment reference or mobile number is required"),
  streetAddress: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(3, "Postal code is required"),
  locationCoordinates: z.string().optional()
});

export type CreateOrderDTO = z.infer<typeof CreateOrderDTO>;
