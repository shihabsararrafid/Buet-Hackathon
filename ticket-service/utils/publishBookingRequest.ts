import amqp from "amqplib";
export async function publishBookingRequest(bookingData: {
  owner_id: string;
  schedule_date: Date;
  start_place: string;
  end_place: string;
  trainId: string;
  seat_no: number[];
}) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "ticket_booking_queue";
  await channel.assertQueue(queue, { durable: true });

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(bookingData)), {
    persistent: true,
  });

  console.log("Booking request published to queue:", bookingData);
  await channel.close();
  await connection.close();
}
