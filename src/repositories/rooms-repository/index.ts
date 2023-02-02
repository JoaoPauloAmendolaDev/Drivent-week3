import { prisma } from "@/config"

async function findRoomsByHotelId(hotelId: number){
    return await prisma.hotel.findFirst({
        where: {
            id : hotelId
        },
        include:{
            Rooms: true
        }
    })
}


const roomsRepository = {
    findRoomsByHotelId
}

export default roomsRepository