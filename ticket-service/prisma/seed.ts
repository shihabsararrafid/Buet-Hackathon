import prisma from "../database/dbConnection";

const trainData = [
  {
    name: "Suborno Express",
    start_place: "Dhaka",
    end_place: "Chittagong",
    number_of_seats: "842",
    ticket_fare: 585,
    schedule: new Date("2024-10-25 07:00:00"),
  },
  {
    name: "Turna Express",
    start_place: "Dhaka",
    end_place: "Chittagong",
    number_of_seats: "756",
    ticket_fare: 535,
    schedule: new Date("2024-10-25 14:30:00"),
  },
  {
    name: "Mahanagar Provati",
    start_place: "Chittagong",
    end_place: "Dhaka",
    number_of_seats: "890",
    ticket_fare: 560,
    schedule: new Date("2024-10-25 06:30:00"),
  },
  {
    name: "Upaban Express",
    start_place: "Dhaka",
    end_place: "Sylhet",
    number_of_seats: "678",
    ticket_fare: 470,
    schedule: new Date("2024-10-25 06:40:00"),
  },
  {
    name: "Parabat Express",
    start_place: "Dhaka",
    end_place: "Sylhet",
    number_of_seats: "724",
    ticket_fare: 485,
    schedule: new Date("2024-10-25 15:20:00"),
  },
  {
    name: "Jayantika Express",
    start_place: "Sylhet",
    end_place: "Dhaka",
    number_of_seats: "692",
    ticket_fare: 465,
    schedule: new Date("2024-10-25 23:00:00"),
  },
  {
    name: "Silk City Express",
    start_place: "Dhaka",
    end_place: "Rajshahi",
    number_of_seats: "864",
    ticket_fare: 545,
    schedule: new Date("2024-10-25 06:00:00"),
  },
  {
    name: "Padma Express",
    start_place: "Dhaka",
    end_place: "Rajshahi",
    number_of_seats: "785",
    ticket_fare: 520,
    schedule: new Date("2024-10-25 16:30:00"),
  },
  {
    name: "Dhumketu Express",
    start_place: "Rajshahi",
    end_place: "Dhaka",
    number_of_seats: "826",
    ticket_fare: 530,
    schedule: new Date("2024-10-25 07:00:00"),
  },
  {
    name: "Sundarban Express",
    start_place: "Dhaka",
    end_place: "Khulna",
    number_of_seats: "912",
    ticket_fare: 590,
    schedule: new Date("2024-10-25 06:20:00"),
  },
  {
    name: "Chitra Express",
    start_place: "Khulna",
    end_place: "Dhaka",
    number_of_seats: "865",
    ticket_fare: 570,
    schedule: new Date("2024-10-25 15:00:00"),
  },
  {
    name: "Rangpur Express",
    start_place: "Dhaka",
    end_place: "Rangpur",
    number_of_seats: "748",
    ticket_fare: 495,
    schedule: new Date("2024-10-25 09:00:00"),
  },
  {
    name: "Ekota Express",
    start_place: "Dhaka",
    end_place: "Dinajpur",
    number_of_seats: "836",
    ticket_fare: 510,
    schedule: new Date("2024-10-25 21:30:00"),
  },
  {
    name: "Tista Express",
    start_place: "Dhaka",
    end_place: "Dewanganj",
    number_of_seats: "668",
    ticket_fare: 320,
    schedule: new Date("2024-10-25 08:45:00"),
  },
  {
    name: "Mohonganj Express",
    start_place: "Dhaka",
    end_place: "Mohonganj",
    number_of_seats: "634",
    ticket_fare: 380,
    schedule: new Date("2024-10-25 14:00:00"),
  },
];
async function main() {
  const trains = await prisma.train.createMany({
    data: trainData,
  });

  console.log({ trains });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
