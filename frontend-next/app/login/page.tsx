"use client";
import React, { Suspense } from "react";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
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
import Link from "next/link";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  // const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Start loading
      // setIsLoading(true);

      // Validate form data
      if (!formData.email || !formData.password) {
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
        `${process.env.NEXT_PUBLIC_AUTH_URL}/api/v1/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data.success && response.data.token) {
        // Store token in session storage
        sessionStorage.setItem("token", response.data.token);

        // Store user data if needed
        if (response.data.user) {
          sessionStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // Show success message
        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome back${
            response.data.user?.name ? `, ${response.data.user.name}` : ""
          }!`,
          timer: 1500,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });

        // Reset form
        setFormData({
          email: "",
          password: "",
        });
        const redirect_url = searchParams.get("redirect_url");

        // Redirect to home page or dashboard
        router.push(
          redirect_url && redirect_url !== null ? `/${redirect_url}` : "/"
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex items-center justify-between w-full text-sm">
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Forgot password?
            </a>
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700"
            >
              Create account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
