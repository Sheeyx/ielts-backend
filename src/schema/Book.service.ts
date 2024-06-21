import BookModul from "../models/Book.modul";
import Errors, { HttpCode, Message } from "../libs/Errors";
import PracticesModel from "../models/Practices.model";
import mongoose, { ObjectId } from "mongoose";
import { PracticeType } from "../libs/enums/book";

class BookService {
    private readonly bookModel;
    private readonly practiceModel;
    constructor(){
        this.bookModel = BookModul;
        this.practiceModel = PracticesModel;
    }

    public async createBook(input:any):Promise<any>{
        try {
            const result = await this.bookModel.create(input);
            return result.toJSON();
        } catch (err) {
            console.log(err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    public async getAllBooks():Promise<any>{
        const result = await this.bookModel.find().exec();
        console.log(result);
        
        return result;
    }

}

export default BookService;