import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters"),
  email: z.string().email("Please enter a valid email address").max(255, "Email must not exceed 255 characters"),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone format")
    .optional()
    .or(z.literal('')),
  organization: z.string().trim().max(200, "Organization name must not exceed 200 characters").optional(),
  inquiryType: z.string().min(1, "Please select an inquiry type").max(50, "Inquiry type is invalid"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message must not exceed 2000 characters"),
});

export const waitlistSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters").max(50, "First name must not exceed 50 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters").max(50, "Last name must not exceed 50 characters"),
  email: z.string().email("Please enter a valid email address").max(255, "Email must not exceed 255 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(255, "Email must not exceed 255 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128, "Password must not exceed 128 characters"),
});

export const signUpSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters").max(50, "First name must not exceed 50 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters").max(50, "Last name must not exceed 50 characters"),
  email: z.string().email("Please enter a valid email address").max(255, "Email must not exceed 255 characters"),
  password: z.string()
    .min(12, "Password must be at least 12 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type WaitlistFormData = z.infer<typeof waitlistSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;

// Pay rate validation utility
export const validatePayRate = (value: string | number): { isValid: boolean; error?: string; value?: number } => {
  const payRateValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(payRateValue)) {
    return { isValid: false, error: 'Pay rate must be a valid number' };
  }
  
  if (payRateValue < 0 || payRateValue > 10000) {
    return { isValid: false, error: 'Pay rate must be between 0 and 10,000' };
  }
  
  return { isValid: true, value: payRateValue };
};
