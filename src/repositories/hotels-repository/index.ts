import { prisma } from "@/config"

async function getAllHotels(){
    return await prisma.hotel.findMany()
}

async function findHotelById(hotelId: number){
    return await prisma.hotel.findFirst({
        where : {
            id : hotelId
        }
    })
}

async function findRoomsByHotelId(hotelId: number){
    
}


const hotelsRepository = {
    getAllHotels,
    findHotelById
}

export {hotelsRepository}