import app, {init} from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { createEnrollmentWithAddress, createHotel, createRoom, createTicket, createTicketType, createTicketTypeForHotel, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { TicketStatus } from "@prisma/client";
import faker from "@faker-js/faker";
import * as jwt from "jsonwebtoken";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb()
});


const server = supertest(app);

describe("GET /hotels", () => {

    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word()

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });


    it("should respond with status 200 and hotels data", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeForHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
        const hotel = await createHotel()

        const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`)
        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining(
            {
                id: hotel.id,
                name: hotel.name,
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            })
        ])
        )
    })
})

describe("GET /hotels/:hotelId", () => {
    it("should respond with status 404 if hotelId is wrong", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeForHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
        const hotel = await createHotel()
        const hotelId = 0

        const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`)
        expect(response.status).toEqual(httpStatus.NOT_FOUND)
    })


    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels/1");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word()

        const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`)
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      it("should respond with status 200 if hotelId is correct and user is logged", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeForHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
        const hotel = await createHotel()
        const rooms = await createRoom(hotel.id)
        
        const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
        console.log(response.body)

        expect(response.status).toBe(httpStatus.OK)

      });
})