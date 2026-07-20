"use client";

import { useState } from "react";
import Link from "next/link";
import { FaPaperPlane, FaArrowLeft, FaCheckCircle, FaLock } from "react-icons/fa";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would call better-auth's forgetPassword
    // For now, we simulate success
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-vh-75 d-flex align-items-center justify-content-center py-5 px-3">
      <div className="card border-0 shadow-lg rounded-lg overflow-hidden" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="card-body p-4 p-md-5">
          {!submitted ? (
            <div className="animate-fade-in">
              <div className="text-center mb-4">
                <div className="bg-primary-light d-inline-flex p-3 rounded-circle text-primary mb-3">
                  <FaLock size={32} />
                </div>
                <h2 className="fw-bold">Forgot Password?</h2>
                <p className="text-muted small">No worries! Enter the email address associated with your account and we&apos;ll send you a link to reset it.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label small fw-bold">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control form-control-lg bg-light border-0" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-100 rounded-pill fw-bold py-3 d-flex align-items-center justify-content-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <>
                      <FaPaperPlane size={14} /> Send Reset Link
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-2">
                <Link href="/login" className="text-decoration-none text-muted small d-flex align-items-center justify-content-center gap-2">
                  <FaArrowLeft size={10} /> Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <div className="animate-scale-in text-center py-4">
              <div className="text-success mb-4 d-inline-block">
                <FaCheckCircle size={80} className="animate-bounce" />
              </div>
              <h2 className="fw-bold mb-2">Check Your Email</h2>
              <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '300px' }}>
                We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your inbox (and spam folder).
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="btn btn-outline-primary rounded-pill px-4"
              >
                Try an alternative email
              </button>
              <div className="mt-5 pt-3 border-top">
                <Link href="/login" className="btn btn-link text-decoration-none text-muted small">
                  Done, take me to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
