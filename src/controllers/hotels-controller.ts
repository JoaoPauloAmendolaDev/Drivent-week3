import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";


export async function getAllHotels(req: AuthenticatedRequest, res: Response){
    const userId = req.userId
    
    try {
        const hotels = await hotelsService.getAllHotels(userId)
    } catch (error) {
        return res.sendStatus(500)
    }
}