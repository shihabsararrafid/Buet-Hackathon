"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Clock, Train } from "lucide-react";
import { useState } from "react";

// Demo data
const DEMO_TRAINS = [
  {
    id: "train_1",
    name: "Padma Express",
    start_place: "Dhaka",
    end_place: "Chittagong",
    number_of_seats: "40",
    ticket_fare: 500,
    schedule: new Date("2024-10-24T10:00:00"),
    tickets: [
      { seat_no: 1, status: "BOOKED" },
      { seat_no: 4, status: "BOOKED" },
      { seat_no: 7, status: "CONFIRMED" },
      { seat_no: 12, status: "BOOKED" },
    ],
  },
  {
    id: "train_2",
    name: "Sundarban Express",
    start_place: "Dhaka",
    end_place: "Chittagong",
    number_of_seats: "40",
    ticket_fare: 450,
    schedule: new Date("2024-10-24T14:00:00"),
    tickets: [
      { seat_no: 2, status: "BOOKED" },
      { seat_no: 5, status: "CONFIRMED" },
      { seat_no: 8, status: "BOOKED" },
    ],
  },
];

const TrainSearchResults = () => {
  const [selectedSeats, setSelectedSeats] = useState({});

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getSeatStatus = (trainId: string, seatNo: number) => {
    const train = DEMO_TRAINS.find((t) => t.id === trainId);
    const ticket = train.tickets.find((t) => t.seat_no === seatNo);
    return ticket ? ticket.status : null;
  };

  const toggleSeatSelection = (trainId: string, seatNo: number) => {
    setSelectedSeats((prev) => {
      const trainSeats = prev[trainId] || [];
      const updatedSeats = trainSeats.includes(seatNo)
        ? trainSeats.filter((s) => s !== seatNo)
        : [...trainSeats, seatNo];

      return {
        ...prev,
        [trainId]: updatedSeats,
      };
    });
  };

  const renderSeats = (train) => {
    const totalSeats = parseInt(train.number_of_seats);
    const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);
    const trainSelectedSeats = selectedSeats[train.id] || [];

    return (
      <div className="grid grid-cols-4 gap-4 mt-4">
        {seats.map((seatNo) => {
          const status = getSeatStatus(train.id, seatNo);
          const isBooked = status === "BOOKED";
          const isConfirmed = status === "CONFIRMED";
          const isSelected = trainSelectedSeats.includes(seatNo);

          return (
            <Button
              key={seatNo}
              className={`h-12 ${
                isBooked
                  ? "bg-red-500 text-white hover:bg-red-600 cursor-not-allowed"
                  : isConfirmed
                  ? "bg-yellow-500 text-white hover:bg-yellow-600 cursor-not-allowed"
                  : isSelected
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => {
                if (!isBooked && !isConfirmed) {
                  toggleSeatSelection(train.id, seatNo);
                }
              }}
              disabled={isBooked || isConfirmed}
            >
              {seatNo}
            </Button>
          );
        })}
      </div>
    );
  };

  const calculateTotalFare = (train) => {
    const numSelectedSeats = (selectedSeats[train.id] || []).length;
    return numSelectedSeats * train.ticket_fare;
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Available Trains</h1>

      <div className="space-y-4">
        {DEMO_TRAINS.map((train) => (
          <Card key={train.id} className="w-full">
            <Collapsible>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Train className="h-6 w-6 text-blue-500" />
                    <div>
                      <h2 className="font-semibold text-lg">{train.name}</h2>
                      <p className="text-sm text-gray-500">
                        {train.start_place} to {train.end_place}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <p className="font-medium">
                        {formatTime(train.schedule)}
                      </p>
                    </div>
                    <p className="text-green-600 font-semibold">
                      ৳{train.ticket_fare}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-200 rounded"></div>
                      <span className="text-sm">Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-sm">Booked</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span className="text-sm">Confirmed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-sm">Selected</span>
                    </div>
                  </div>

                  <CollapsibleTrigger className="flex items-center space-x-2 text-blue-600">
                    <span>Select Seats</span>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                </div>
              </div>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="border-t mt-4 pt-4">{renderSeats(train)}</div>

                  {selectedSeats[train.id]?.length > 0 && (
                    <div className="mt-6 flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          Selected Seats:{" "}
                          {selectedSeats[train.id]
                            .sort((a, b) => a - b)
                            .join(", ")}
                        </p>
                        <p className="text-sm text-gray-500">
                          Total Fare: ৳{calculateTotalFare(train)}
                        </p>
                      </div>
                      <Button
                        onClick={() =>
                          console.log("Booking seats:", selectedSeats[train.id])
                        }
                      >
                        Book {selectedSeats[train.id].length}{" "}
                        {selectedSeats[train.id].length === 1
                          ? "Seat"
                          : "Seats"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrainSearchResults;
