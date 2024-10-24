"use client";
import React from "react";
import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const TicketBookingHome = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");

  const divisions = [
    "Dhaka",
    "Chittagong",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
  ];

  const handleSearch = () => {
    console.log("Search clicked:", {
      fromLocation,
      toLocation,
      selectedDate,
    });
    // Add your search logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Book Your Journey Today</h1>
          <p className="text-xl">
            Find and book tickets for your next adventure
          </p>
        </div>
      </div>

      {/* Search Card */}
      <div className="container mx-auto px-4 -mt-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Search Tickets</CardTitle>
            <CardDescription>
              Select your journey details to find available tickets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* From Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">From</label>
                  <Select value={fromLocation} onValueChange={setFromLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select departure" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisions.map((division) => (
                        <SelectItem
                          key={division}
                          value={division.toLowerCase()}
                        >
                          {division}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* To Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">To</label>
                  <Select value={toLocation} onValueChange={setToLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisions.map((division) => (
                        <SelectItem
                          key={division}
                          value={division.toLowerCase()}
                        >
                          {division}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Journey Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="pl-10"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSearch}
                className="w-full"
                disabled={!fromLocation || !toLocation || !selectedDate}
              >
                Search Tickets
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12">
          <Card className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Book your tickets with just a few clicks
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Safe and secure payment methods</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round the clock customer support</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketBookingHome;
