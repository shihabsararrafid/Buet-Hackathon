"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  Clock,
  Mail,
  MapPin,
  Train,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const PaymentPage = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [step, setStep] = useState(1); // 1: Payment, 2: Processing, 3: Confirmation
  const [paymentMethod, setPaymentMethod] = useState("card");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isProcessing, setIsProcessing] = useState(false);

  // This would normally come from route params or state management
  // For demo purposes, we're hardcoding it
  const bookingDetails = {
    trainName: "Padma Express",
    startPlace: "Dhaka",
    endPlace: "Chittagong",
    selectedSeats: [5, 6, 7],
    schedule: new Date("2024-10-24T10:00:00"),
    ticketFare: 500,
    totalFare: 1500,
  };

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    email: "",
    mobileNumber: "",
  });

  useEffect(() => {
    if (timeLeft > 0 && step === 1) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && step === 1) {
      router.push("/search-results"); // Redirect back to search results
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, step]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const searchParams = useSearchParams();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setStep(2);

      // Get booking details from URL or state

      const bookingId = searchParams.get("bookingId") ?? "";
      // Make the API call to confirm ticket
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/ticket/confirm-ticket/${bookingId}`,
        {
          // Add any required request body here
          paymentMethod,
          email: formData.email,
          amount: bookingDetails.totalFare,
          // Add other payment details as needed
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Add any required headers
          },
        }
      );

      if (response.data.success) {
        // Payment successful
        setStep(3);
        Swal.fire("Success");

        // Show success message
        // toast({
        //   title: "Payment Successful",
        //   description: "Your ticket has been confirmed",
        //   variant: "success",
        // });

        // You might want to store the confirmation details
        // setConfirmationDetails(response.data.data);
      } else {
        // Payment failed but API responded
        throw new Error(response.data.message || "Payment failed");
      }
    } catch (error) {
      // Handle different types of errors
      let errorMessage = "Payment failed. Please try again.";

      if (axios.isAxiosError(error)) {
        // Network or API errors
        if (error.response) {
          // The server responded with a status code outside the 2xx range
          switch (error.response.status) {
            case 400:
              errorMessage =
                "Invalid payment details. Please check and try again.";
              break;
            case 401:
              errorMessage = "Authentication failed. Please log in again.";
              break;
            case 404:
              errorMessage = "Ticket not found. Please try booking again.";
              break;
            case 409:
              errorMessage = "This ticket has already been confirmed.";
              break;
            case 500:
              errorMessage = "Server error. Please try again later.";
              break;
            default:
              errorMessage = error.response.data.message || errorMessage;
          }
        } else if (error.request) {
          // The request was made but no response was received
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          errorMessage =
            "No response from server. Please check your connection.";
        }
      }
      Swal.fire("Failed");
      //   // Show error toast
      //   toast({
      //     title: "Payment Failed",
      //     description: errorMessage,
      //     variant: "destructive",
      //   });

      // Reset to payment form
      setStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="space-y-6">
            <div className="rounded-lg bg-green-50 p-6 flex items-center space-x-3">
              <Check className="h-8 w-8 text-green-500" />
              <div>
                <h4 className="text-xl font-medium text-green-800">
                  Payment Successful!
                </h4>
                <p className="text-green-600">
                  Your tickets have been booked successfully
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Booking Confirmation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600">
                    A confirmation email has been sent to {formData.email}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Train className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{bookingDetails.trainName}</p>
                      <p className="text-sm text-gray-600">
                        {bookingDetails.startPlace} to {bookingDetails.endPlace}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">
                        {bookingDetails.schedule.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {bookingDetails.schedule.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">
                        Seats: {bookingDetails.selectedSeats.join(", ")}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total Fare: ৳{bookingDetails.totalFare}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/search-results")}
                  >
                    Back to Search
                  </Button>
                  <Button onClick={() => window.print()}>Print Ticket</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Header with timer */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/search-results")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <div className="flex items-center text-red-500">
            <Clock className="h-5 w-5 mr-1" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {/* Payment Form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="bkash">bKash</SelectItem>
                        <SelectItem value="nagad">Nagad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentMethod === "card" && (
                    <>
                      <div className="space-y-2">
                        <Label>Card Number</Label>
                        <Input
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Expiry Date</Label>
                          <Input
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>CVV</Label>
                          <Input
                            name="cvv"
                            type="password"
                            maxLength={3}
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
                    <div className="space-y-2">
                      <Label>Mobile Number</Label>
                      <Input
                        name="mobileNumber"
                        placeholder="01XXXXXXXXX"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Email (for confirmation)</Label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Train</span>
                    <span className="font-medium">
                      {bookingDetails.trainName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route</span>
                    <span className="font-medium">
                      {bookingDetails.startPlace} - {bookingDetails.endPlace}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats</span>
                    <span className="font-medium">
                      {bookingDetails.selectedSeats.join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">
                      {bookingDetails.schedule.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">
                      {bookingDetails.schedule.toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>৳{bookingDetails.totalFare}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handlePayment}
                  disabled={
                    !formData.email ||
                    (paymentMethod === "card" &&
                      (!formData.cardNumber ||
                        !formData.expiryDate ||
                        !formData.cvv))
                  }
                >
                  {step === 2 ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Pay ৳${bookingDetails.totalFare}`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
