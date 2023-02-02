import app, {init} from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { createEnrollmentWithAddress, createHotel, createTicket, createTicketType, createTicketTypeForHotel, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb()
});

const server = supertest(app);

describe("GET /hotels", () => {
    it("should respond with status 200 and hotels data", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeForHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
        const hotel = await createHotel()
        console.log('chegou aqui')

        const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`)
        console.log(response.body, 'response aqui')
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