"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signUp } from "@/lib/auth-client";
import { FaLeaf, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      }, {
        onSuccess: () => {
          toast.success("Welcome to the family! Account created.");
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Registration failed");
        }
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card animate-scale-in">
      <div className="auth-header">
        <div className="auth-logo">
          <FaLeaf /> <span>Herb Approach</span>
        </div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join Canada&apos;s premium dispensary</p>
      </div>

      <button className="social-btn mb-4">
        <FaGoogle /> Sign up with Google
      </button>

      <div className="divider">
        <span>or with your email</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form-plant">
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="John Doe"
            {...register("name")}
          />
          {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="name@example.com"
            {...register("email")}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            placeholder="Min. 8 characters"
            {...register("password")}
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>

        <div className="mb-4">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
            placeholder="Repeat password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
        </div>

        <button 
          type="submit" 
          className="btn btn-plant w-100 py-3 mb-4"
          disabled={isLoading}
        >
          {isLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : "Create Account"}
        </button>

        <p className="text-center mb-0 text-muted small">
          Already have an account? <Link href="/login" className="text-primary fw-bold">Login Here</Link>
        </p>
      </form>
    </div>
  );
}
