// tests/controllers/ticket.controller.test.ts
const {
  BookTicket,
  ConfirmTicket,
} = require("../../controllers/ticket/ticket.controller");
const {
  ConfirmTicketService,
} = require("../../controllers/ticket/ticket.service");
const { RabbitMQService } = require("../../services/rabbitmq.service");
const { publishBookingRequest } = require("../../utils/publishBookingRequest");

// Mocks
jest.mock("./../src/services/rabbitmq.service.ts");
jest.mock("./../utils/utils/publishBookingRequest.ts");
jest.mock("./../src/modules/ticket/ticket.service.ts");
jest.mock("../database/dbConnection.ts");

describe("Ticket Controller Tests", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      body: {
        userId: "123",
        trainId: "456",
        seats: 2,
      },
      params: {
        id: "booking123",
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("BookTicket", () => {
    const mockBookingData = {
      id: "booking123",
      userId: "123",
      trainId: "456",
      seats: 2,
      status: "PENDING",
    };

    it("should successfully book a ticket", async () => {
      publishBookingRequest.mockReturnValue(mockBookingData);

      await BookTicket(mockRequest, mockResponse, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Ticket Booked Successfully",
        result: mockBookingData,
      });
      expect(nextFunction).toHaveBeenCalled();
    });

    it("should handle errors during booking", async () => {
      const error = new Error("Booking failed");
      publishBookingRequest.mockRejectedValue(error);

      await BookTicket(mockRequest, mockResponse, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "Failed",
        message: "Failed to book ticket",
        error: "Booking failed",
      });
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe("ConfirmTicket", () => {
    const mockConfirmedTicket = {
      id: "booking123",
      userId: "123",
      trainId: "456",
      seats: 2,
      status: "CONFIRMED",
      userEmail: "user@example.com",
    };

    beforeEach(() => {
      RabbitMQService.getInstance.mockReturnValue({
        initialize: jest.fn(),
        publishNotification: jest.fn().mockResolvedValue(true),
      });
    });

    it("should successfully confirm a ticket", async () => {
      ConfirmTicketService.mockResolvedValue(mockConfirmedTicket);

      await ConfirmTicket(mockRequest, mockResponse, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Ticket Confirmed",
        result: mockConfirmedTicket,
      });
      expect(nextFunction).toHaveBeenCalled();
    });

    it("should handle errors during confirmation", async () => {
      const error = new Error("Confirmation failed");
      ConfirmTicketService.mockRejectedValue(error);

      await ConfirmTicket(mockRequest, mockResponse, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "Failed",
        message: "Ticket Confirmation Failed",
        error: "Confirmation failed",
      });
      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
