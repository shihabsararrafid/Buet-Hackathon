"use client";
import React, { Suspense } from "react";
import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Start loading
      // setIsLoading(true);

      // Validate form data
      if (!formData.email || !formData.password || !formData.name) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Please fill in all fields",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      // Show loading state
      Swal.fire({
        title: "Logging in...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Make API call to login endpoint
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/api/user/adduser`,
        {
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }
      );

      if (response.data.success) {
        // Store user data if needed
        if (response.data.user) {
          sessionStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // Show success message
        await Swal.fire({
          icon: "success",
          title: "Registration Successful",

          timer: 1500,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });

        const redirect_url = searchParams.get("redirect_url");

        // Redirect to home page or dashboard
        router.push(
          redirect_url && redirect_url !== null
            ? `login?redirect_url=${redirect_url}`
            : "/"
        );
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      let errorTitle = "Login Failed";

      if (axios.isAxiosError(error)) {
        // Handle different error status codes
        if (error.response) {
          switch (error.response.status) {
            case 400:
              errorMessage = "Invalid email or password format.";
              errorTitle = "Invalid Input";
              break;
            case 401:
              errorMessage = "Incorrect email or password.";
              errorTitle = "Authentication Failed";
              break;
            case 404:
              errorMessage =
                "Account not found. Please check your email or sign up.";
              errorTitle = "Account Not Found";
              break;
            case 429:
              errorMessage = "Too many login attempts. Please try again later.";
              errorTitle = "Too Many Attempts";
              break;
            case 500:
              errorMessage = "Server error. Please try again later.";
              errorTitle = "Server Error";
              break;
            default:
              errorMessage = error.response.data.message || errorMessage;
          }
        } else if (error.request) {
          errorMessage =
            "No response from server. Please check your connection.";
          errorTitle = "Connection Error";
        }
      }

      // Show error message
      await Swal.fire({
        icon: "error",
        title: errorTitle,
        text: errorMessage,
        confirmButtonColor: "#3085d6",
      });

      // Clear password field on error
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));
    } finally {
      // setIsLoading(false);
    }
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to register for a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
