// tests/services/ticket.service.test.ts
const { Prisma } = require("@prisma/client");
const prisma = require("../../../database/dbConnection");

jest.mock("../../../database/dbConnection");

describe("Ticket Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("BookTicketService", () => {
    const mockTicketData = {
      userId: "123",
      trainId: "456",
      seats: 2,
    };

    it("should successfully create a ticket booking", async () => {
      const mockCreatedTicket = {
        ...mockTicketData,
        id: "booking123",
        status: "PENDING",
      };
      prisma.ticket_booking.create.mockResolvedValue(mockCreatedTicket);

      const result = await BookTicketService(mockTicketData);

      expect(result).toEqual(mockCreatedTicket);
      expect(prisma.ticket_booking.create).toHaveBeenCalledWith({
        data: mockTicketData,
      });
    });

    it("should handle train not found error", async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError("", {
        code: "P2001",
        clientVersion: "1.0",
      });
      prisma.ticket_booking.create.mockRejectedValue(prismaError);

      await expect(BookTicketService(mockTicketData)).rejects.toThrow(
        "Train not found"
      );
    });

    it("should handle duplicate booking error", async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError("", {
        code: "P2002",
        clientVersion: "1.0",
      });
      prisma.ticket_booking.create.mockRejectedValue(prismaError);

      await expect(BookTicketService(mockTicketData)).rejects.toThrow(
        "Ticket is already booked"
      );
    });
  });

  describe("ConfirmTicketService", () => {
    const bookingId = "booking123";

    it("should successfully confirm a ticket", async () => {
      const mockConfirmedTicket = {
        id: bookingId,
        status: "CONFIRMED",
        userId: "123",
        trainId: "456",
      };
      prisma.ticket_booking.update.mockResolvedValue(mockConfirmedTicket);

      const result = await ConfirmTicketService(bookingId);

      expect(result).toEqual(mockConfirmedTicket);
      expect(prisma.ticket_booking.update).toHaveBeenCalledWith({
        where: { id: bookingId },
        data: { status: "CONFIRMED" },
      });
    });

    it("should handle booking not found error", async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError("", {
        code: "P2001",
        clientVersion: "1.0",
      });
      prisma.ticket_booking.update.mockRejectedValue(prismaError);

      await expect(ConfirmTicketService(bookingId)).rejects.toThrow(
        "Train not found"
      );
    });
  });
});
