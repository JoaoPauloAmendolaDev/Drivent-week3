import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";


export async function getAllHotels(req: AuthenticatedRequest, res: Response){
    const userId = req.userId
    
    try {
        const hotels = await hotelsService.getAllHotels(userId)
        return res.status(httpStatus.OK).send(hotels)
    } catch (error) {
        return res.sendStatus(500)
    }
}

export async function listAllRooms(req: AuthenticatedRequest, res: Response){
    const userId: number = req.userId
    const hotelId: number = parseInt(req.params.hotelId)

    try {
        const rooms = await hotelsService.getAllroom(userId, hotelId)
        return res.status(httpStatus.OK).send(rooms)
    } catch (error) {    
        if (error.name === "UnauthorizedError") {
        return res.sendStatus(httpStatus.UNAUTHORIZED);
      }
      else if(error.name === "NotFoundError") {
        return res.sendStatus(httpStatus.NOT_FOUND)
      }
      console.log(error.name)
        return res.sendStatus(500)
    }
}