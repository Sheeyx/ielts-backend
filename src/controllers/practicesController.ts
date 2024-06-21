import {Request, Response} from 'express';  
import {T} from "../libs/types/common";
import PracticesService from '../schema/Practice.service';
import Errors, { HttpCode } from '../libs/Errors';
import { Message } from '../libs/Errors';
import { shapeIntoMongooseObjectId } from '../libs/config';

export const practicesController : T = {};
const practiceService = new PracticesService();

practicesController.createPractice = async(req: Request, res: Response) => {
    const input = req.body;
    try {
        const data: any = {
            images: req.files && 'practicesImage' in req.files && req.files['practicesImage'] ? 
                (req.files['practicesImage'] as any[]).map(file => file.path) : [],
            audio: req.files && 'audio' in req.files && req.files['audio'] ? 
                (req.files['audio'][0] as any).path : null
        };

        input.practicesImage = data.images;
        input.audio = data.audio;
        console.log(input);
        
        
        const result = await practiceService.createPractice(input);
        res.status(200).json(result);
    } catch(err){
        console.log(err);
    }
}

practicesController.createAnswers = async(req: Request, res: Response) => {
    try {
        const data: any = req.body;
        console.log(req.files);
        
        if (req.files) {
            data.practicesImage = (req.files as Express.Multer.File[]).map(file => file.path);
        }
        
        const result = await practiceService.createPractice(data);
        res.status(200).json(result);
    } catch(err){
        console.log(err);
    }
}


// practicesController.getPracticeByAdmin = async (req: Request, res: Response) => {
//     try {
//         const {id} = req.params;
//         const result = await practiceService.getPracticesByBookId(id);
        
//         res.status(HttpCode.CREATED).json(result);
        
//     } catch (err) {
//         console.log("Error, getMyOrders", err);
//         if(err instanceof Errors) res.status(err.code).json(err);
//         else res.status(Errors.standard.code).json(Errors.standard);
//     }
    
// };

practicesController.createAnswers = async(req: Request, res: Response) => {
    try {
        const data: any = req?.body;       
         
        const result = await practiceService.createAnswers(data);
        res.status(200).json(result);
    } catch(err){
        console.log(err);
    }
}

practicesController.checkAnswers = async(req: Request, res: Response) => {
    try {
        const data: any = req?.body;       
         
        const result = await practiceService.checkAnswers(data);
        res.status(200).json(result);
    } catch(err){
        console.log(err);
    }
}

practicesController.getPracticesByBookId = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        const result = await practiceService.getPracticesByBookId(id);
        res.status(200).json(result);
    } catch(err){
        console.log(err);
    }
}

practicesController.getReadingBooksByBookId = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        const result = await practiceService.getReadingBooksByBookId(id);
        res.status(200).json(result);
    } catch(err){
        console.log(err);
    }
}

practicesController.getPracticesById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const result = await practiceService.getPracticesById(id);
        res.status(200).json(result);
    } catch(err){
        console.log(err);
    }
}
