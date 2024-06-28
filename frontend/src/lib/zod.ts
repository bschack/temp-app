import { JwtPayload } from "jsonwebtoken";
import { date, literal, number, object, string, z } from "zod";
import { PriceResponseSchema, QuoteResponseSchema, SeriesResponseSchema } from "./rapid/schema";

enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export const signInSchema = object({
  email: string({ required_error: "Username is required" })
    .email("Invalid email")
  // .min(1, "Username is required")
  // .max(32, "Username must be less than 32 characters")
  ,
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(3, "Password must be more than 3 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const UserSchema = object({
  id: string().uuid(),
  email: string().email(),
  password: string(),
  name: string(),
  emailVerified: date().nullish(),
  image: string().url().nullish(),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
});

export type User = z.infer<typeof UserSchema>;

export type Session = string | false | JwtPayload;

export const SessionPayloadSchema = object({
  userId: string().uuid(),
  userRole: z.enum([UserRole.ADMIN, UserRole.USER]),
  name: string(),
  image: string().url().nullish(),
  exp: number(),
  iat: number(),
});

export type SessionPayload = z.infer<typeof SessionPayloadSchema> | false;

export const StockDataSchema = object({
  quote: QuoteResponseSchema,
  price: PriceResponseSchema,
  series: SeriesResponseSchema,
});

export type StockData = z.infer<typeof StockDataSchema>;
