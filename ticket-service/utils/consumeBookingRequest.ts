import amqp from "amqplib";
import prisma from "./../database/dbConnection";
type bookingDataType = {
  start_place: string;
  end_place: string;
  schedule_at: Date;
  seatNo: number[];
  trainId: string;
};
export async function consumeBookingRequests() {
  const connection = await amqp.connect("amqp://rabbitmq:5672");
  const channel = await connection.createChannel();

  const queue = "ticket_booking_queue";
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg: any) => {
    if (msg !== null) {
      const bookingData: bookingDataType = JSON.parse(msg.content.toString());

      try {
        const result = await processBooking(bookingData);
        console.log("Booking processed:", result);

        channel.ack(msg);
      } catch (error) {
        console.error("Error processing booking:", error.message);

        channel.ack(msg);
      }
    }
  });
}
async function processBooking(data) {
  const existingBooking = await prisma.ticket_booking.findFirst({
    where: {
      trainId: data.trainId,
      start_place: data.start_place,
      end_place: data.end_place,
      schedule_date: data.schedule_date,

      seat_no: {
        hasSome: data.seat_no,
      },
    },
  });

  if (existingBooking) {
    throw new Error(
      "One or more of the selected seats are already booked for this schedule."
    );
  }

  // If no booking conflict is found, proceed with booking creation
  try {
    await prisma.ticket_booking.create({
      data: {
        owner_id: data.owner_id,
        schedule_date: data.schedule_date,
        start_place: data.start_place,
        end_place: data.end_place,
        trainId: data.trainId,
        seat_no: data.seat_no, // This will store the array of seat numbers
        status: "BOOKED", // Assuming default status is 'BOOKED'
      },
    });

    // Return success response
    return {
      success: true,
      message: "Booking successful",
      seat_no: data.seat_no,
      schedule_date: data.schedule_date,
    };
  } catch (error) {
    // In case of any errors during booking creation, throw an error
    throw new Error("Booking failed due to a system issue. Please try again.");
  }
}
