import { prisma } from "@/config";
import faker from "@faker-js/faker";
import dayjs from "dayjs";

export async function createHotel(){
    return prisma.hotel.create({
        data:{
            name: faker.name.findName(),
            image: faker.image.city(),
            createdAt: dayjs().toISOString(),
            updatedAt: dayjs().toISOString()
        }
    })
}

export async function createRoom(hotelId: number){
    return prisma.room.create({
        data:{
            name: `${faker.datatype.number({max : 1000})}`,
            capacity: faker.datatype.number(),
            hotelId: hotelId,
            createdAt: dayjs().toISOString(),
            updatedAt: dayjs().toISOString()
        }
    })
}