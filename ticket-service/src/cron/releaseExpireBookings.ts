import prisma from "database/dbConnection";
import cron from "node-cron";

// Run this every minute to clear expired reservations
cron.schedule("* * * * *", async () => {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    // Find expired reservations
    const expiredReservations = await prisma.ticket_booking.findMany({
      where: {
        status: "BOOKED",
        purchased_at: {
          lt: tenMinutesAgo, // Find reservations where expiration time has passed
        },
      },
    });

    // Release the reserved seats
    for (const reservation of expiredReservations) {
      await prisma.ticket_booking.delete({
        where: {
          id: reservation.id,
        },
      });
      console.log(
        `Reservation expired and released for booking ID: ${reservation.id}`
      );
    }
  } catch (error) {
    console.error("Error releasing expired reservations:", error);
  }
});
