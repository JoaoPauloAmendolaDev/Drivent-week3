import { notFoundError } from "@/errors";
import { paymentRequiredError } from "@/errors/payment-Required-error";
import enrollmentRepository from "@/repositories/enrollment-repository"
import { hotelsRepository } from "@/repositories/hotels-repository";
import roomsRepository from "@/repositories/rooms-repository";
import ticketRepository from "@/repositories/ticket-repository";


async function getAllHotels(userId: number){
    const userHaveEnrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if(!userHaveEnrollment) throw notFoundError();

    const userHaveTicket = await ticketRepository.findTicketByEnrollmentId(userHaveEnrollment.id)
    if(!userHaveTicket ) throw notFoundError();
    if(userHaveTicket.status === "RESERVED") throw paymentRequiredError()

    const userTicketInfo = await ticketRepository.findTicketTypeByTicketId(userHaveTicket.ticketTypeId)
    if(userTicketInfo.isRemote || !userTicketInfo.includesHotel) throw paymentRequiredError()

    const hotels = await hotelsRepository.getAllHotels()

    return hotels
}

async function getAllroom(userId: number, hotelId: number){
    console.log(hotelId, 'hotel id AQUI')
    const hotelExist = await hotelsRepository.findHotelById(hotelId)
    if(!hotelId || !hotelExist){
    console.log('aqui é onde ele deveria entrar') 
    throw notFoundError()
}
    const userHaveEnrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if(!userHaveEnrollment) throw notFoundError();

    const userHaveTicket = await ticketRepository.findTicketByEnrollmentId(userHaveEnrollment.id)
    if(!userHaveTicket ) throw notFoundError();
    if(userHaveTicket.status === "RESERVED") throw paymentRequiredError()

    const userTicketInfo = await ticketRepository.findTicketTypeByTicketId(userHaveTicket.ticketTypeId)
    if(userTicketInfo.isRemote || !userTicketInfo.includesHotel) throw paymentRequiredError()

    const allRooms = await roomsRepository.findRoomsByHotelId(hotelId)
    if(!allRooms) throw notFoundError()

    return allRooms
}


const hotelsService = {
    getAllHotels,
    getAllroom
}

export default hotelsService