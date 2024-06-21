import {Request, Response} from 'express';  
import {T} from "../libs/types/common";
import BookService from '../schema/Book.service';

export const bookController : T = {};
const bookService = new BookService();

bookController.createBook = async (req: Request, res: Response) => {
    try {
        console.log(req.file);
        
        const input:any = req.body;
        if(req.file){
            input.bookImages = req.file.path;
        }

        const result = await bookService.createBook(input);
        res.status(200).json(result);
    } catch(err){
        console.log(err);
    }
}

bookController.getAllBooks = async (req: Request, res: Response) => {
    try {
        const result = await bookService.getAllBooks();
        res.status(200).json(result);
    } catch(err){
        console.log(err);
    }
}