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