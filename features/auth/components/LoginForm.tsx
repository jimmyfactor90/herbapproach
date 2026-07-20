"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "@/lib/auth-client";
import { FaLeaf, FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: callbackUrl,
      }, {
        onSuccess: () => {
          toast.success("Welcome back to Plantopia!");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Login failed");
        }
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: callbackUrl,
    });
  };

  return (
    <div className="auth-card animate-scale-in">
      <div className="auth-header">
        <div className="auth-logo">
          <FaLeaf /> <span>Herb Approach</span>
        </div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to your premium dispensary account</p>
      </div>

      <button className="social-btn mb-4" onClick={handleGoogleLogin}>
        <FaGoogle /> Continue with Google
      </button>

      <div className="divider">
        <span>or login with email</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form-plant">
        <div className="mb-3 position-relative">
          <label className="form-label">Email Address</label>
          <div className="input-with-icon">
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="name@example.com"
              {...register("email")}
            />
          </div>
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label mb-0">Password</label>
            <Link href="/forgot-password" style={{ fontSize: '0.8rem', color: '#2D6A4F' }}>
              Forgot?
            </Link>
          </div>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="••••••••"
              {...register("password")}
            />
            <button 
              type="button"
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted text-decoration-none pe-3"
              onClick={() => setShowPassword(!showPassword)}
              style={{ zIndex: 10 }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>

        <button 
          type="submit" 
          className="btn btn-plant w-100 py-3 mb-4"
          disabled={isLoading}
        >
          {isLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : "Sign In"}
        </button>

        <p className="text-center mb-0 text-muted small">
          Don't have an account? <Link href="/register" className="text-primary fw-bold">Sign Up Free</Link>
        </p>
      </form>
    </div>
  );
}
