"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ChevronDown, Clock, Loader2, Train } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Swal from "sweetalert2";
// Enum for ticket status
enum BookingStatus {
  BOOKED = "BOOKED",
  CONFIRMED = "CONFIRMED",
}

// Interface for ticket data
interface Ticket {
  id: string;
  owner_id: string;
  schedule_date: Date;
  purchased_at: Date;
  start_place: string;
  end_place: string;
  trainId: string;
  seat_no: number[];
  status: BookingStatus;
}

// Interface for train data
interface Train {
  id: string;
  name: string;
  start_place: string;
  end_place: string;
  number_of_seats: string;
  ticket_fare: number;
  schedule: Date;
  tickets: Ticket[];
}

// Interface for selected seats state
interface SelectedSeats {
  [trainId: string]: number[];
}

// Interface for API response
interface ApiResponse {
  data: Train[];
}
export default function TrainSearchResultsComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrainSearchResults />
    </Suspense>
  );
}
const TrainSearchResults = () => {
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeats>({});
  const [trains, setTrains] = useState<Train[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const from = searchParams.get("from");
        const to = searchParams.get("to");
        const scheduleDate = searchParams.get("schedule_date");
        console.log(searchParams);
        if (!from || !to || !scheduleDate) {
          throw new Error("Missing required search parameters");
        }

        const response: ApiResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/train`,
          {
            params: {
              start_place: from,
              end_place: to,
              schedule_date: new Date(scheduleDate).toISOString(),
            },
          }
        );

        // Transform API response dates to Date objects
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const transformedTrains = response?.data?.result?.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (train: { schedule: string | number | Date; tickets: any[] }) => ({
            ...train,
            schedule: new Date(train.schedule),
            tickets: train.tickets.map(
              (ticket: {
                schedule_date: string | number | Date;
                purchased_at: string | number | Date;
              }) => ({
                ...ticket,
                schedule_date: new Date(ticket.schedule_date),
                purchased_at: new Date(ticket.purchased_at),
              })
            ),
          })
        );

        setTrains(transformedTrains);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch trains");
        console.error("Error fetching trains:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrains();
  }, [searchParams]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getSeatStatus = (
    trainId: string,
    seatNo: number
  ): BookingStatus | null => {
    const train = trains.find((t) => t.id === trainId);
    const ticket = train?.tickets.find((t) => t.seat_no.includes(seatNo));
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

  const renderSeats = (train: Train) => {
    const totalSeats = parseInt(train.number_of_seats);
    const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);
    const trainSelectedSeats = selectedSeats[train.id] || [];

    return (
      <div className="grid grid-cols-4 gap-4 mt-4">
        {seats.map((seatNo) => {
          const status = getSeatStatus(train.id, seatNo);
          const isBooked = status === BookingStatus.BOOKED;
          const isConfirmed = status === BookingStatus.CONFIRMED;
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

  const calculateTotalFare = (train: Train): number => {
    const numSelectedSeats = (selectedSeats[train.id] || []).length;
    return numSelectedSeats * train.ticket_fare;
  };

  const handleBooking = async (train: Train) => {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Session Expired",
          text: "Please login to continue",
          timer: 1500,
        }).then(() => {
          router.push(`/login?redirect_url=${window.location.pathname}`);
        });
      }
      const selectedSeatsList = selectedSeats[train.id];
      const scheduleDate = new Date(searchParams.get("schedule_date") || "");

      // First attempt to book all selected seats
      const seats: number[] = [];
      selectedSeatsList.map(async (seatNo) => {
        seats.push(seatNo);
        return {};
      });
      const ticketData = {
        owner_id: "user_id", // Replace with actual user ID from your auth system
        schedule_date: scheduleDate,
        start_place: train.start_place,
        end_place: train.end_place,
        trainId: train.id,
        seat_no: seats,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/ticket/book-ticket`,
        ticketData
      );

      //   // If all bookings are successful, prepare booking details for payment
      //   const bookingDetails = {
      //     trainId: train.id,
      //     trainName: train.name,
      //     startPlace: train.start_place,
      //     endPlace: train.end_place,
      //     selectedSeats: selectedSeatsList,
      //     schedule: train.schedule,
      //     ticketFare: train.ticket_fare,
      //     totalFare: calculateTotalFare(train),
      //     scheduleDate: scheduleDate, // Add this to your BookingDetails interface
      //   };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      router.push(`/payment?bookingId=${response?.data?.result?.id}`);
    } catch (error) {
      // Handle specific error cases
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to book tickets";

        if (error.response?.status === 400) {
          // Handle already booked error
          toast({
            title: "Booking Failed",
            description:
              "One or more seats are already booked. Please try different seats.",
            variant: "destructive",
          });
        } else if (error.response?.status === 404) {
          // Handle train not found error
          toast({
            title: "Booking Failed",
            description: "Train not found. Please refresh and try again.",
            variant: "destructive",
          });
        } else {
          // Handle other errors
          toast({
            title: "Booking Failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
    }
  };
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading available trains...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <h2 className="font-semibold mb-2">Error Loading Trains</h2>
          <p>{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (trains.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
          <h2 className="font-semibold mb-2">No Trains Found</h2>
          <p>No trains available for the selected route and date.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.back()}
          >
            Modify Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Available Trains</h1>
        <div className="text-sm text-gray-500">
          {searchParams.get("from")} to {searchParams.get("to")} •{" "}
          {new Date(
            searchParams.get("schedule_date") ?? ""
          ).toLocaleDateString()}
        </div>
      </div>

      <div className="space-y-4">
        {trains.map((train) => (
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
                      <Button onClick={() => handleBooking(train)}>
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
