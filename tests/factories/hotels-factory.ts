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