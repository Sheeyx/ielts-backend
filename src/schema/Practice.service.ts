import BookModul from "../models/Book.modul";
import Errors, { HttpCode, Message } from "../libs/Errors";
import PracticesModel from "../models/Practices.model";
import AnswersModel from "../models/Answers.model";
import { shapeIntoMongooseObjectId } from "../libs/config";
import mongoose from "mongoose";
import { PracticeType } from "../libs/enums/book";


class PracticesService {
    private readonly practiceModel;
    private readonly answersModel;
    constructor(){
        this.practiceModel = PracticesModel;
        this.answersModel = AnswersModel;
    }

    public async createPractice(input:any):Promise<any>{
        try {
            const result = await this.practiceModel.create({
                title: input.title,
                practicesImage: input.practicesImage,
                bookId: input.bookId,
                audio: input.audio,
                practiceType: input.practiceType,
            });
            return result.toJSON();
        } catch (err) {
            console.log(err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    public async createAnswers(input:any):Promise<any>{
        try {
            const result = await this.answersModel.create(input);
            return result.toJSON();
        } catch (err) {
            console.log(err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    
    public async getPracticesByBookId(bookId:string):Promise<any>{
            try {
                const result = await this.practiceModel.aggregate([
                    {
                        $match: {
                            bookId: new mongoose.Types.ObjectId(bookId),
                            practiceType: PracticeType.LISTENING
                        }
                    }
                ]);
                
                return result;
    
            } catch (error) {
                console.error(error);
            }
        }

        public async getReadingBooksByBookId(bookId:string):Promise<any>{
            try {
                const result = await this.practiceModel.aggregate([
                    {
                        $match: {
                            bookId: new mongoose.Types.ObjectId(bookId),
                            practiceType: PracticeType.READING
                        }
                    }
                ]);
                
                return result;
    
            } catch (error) {
                console.error(error);
            }
        }

        public async getPracticesById(id:string):Promise<any>{
            try {
                const result = await this.practiceModel.findById(id);
                return result;
    
            } catch (error) {
                console.error(error);
            }
        }

        public async checkAnswers(inputData:any):Promise<any>{
            try {
                const result = await this.answersModel.aggregate([
                    {
                        $match: {
                            practiceId: new mongoose.Types.ObjectId(inputData.id),
                        }
                    }
                ]);
                console.log(inputData.input, result);
                
                const data = this.checking(result[0].answers, inputData.input)
                return data;
            } catch (err) {
                console.log(err);
                throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
            }
        }

        public async checking(data:any, answers:any) {
            try {
                // Ensure both arrays have the same length
                if (data.length !== answers.length) {
                    throw new Error('Data and answers arrays must have the same length');
                }
        
                let correctCount = 0;
                let incorrectCount = 0;
                let result = [];
        
                for (let i = 0; i < data.length; i++) {
                    // Compare each element of data with the corresponding element in answers
                    if (data[i] === answers[i]) {
                        result.push("correct");
                        correctCount++;
                    } else {
                        result.push("incorrect");
                        incorrectCount++;
                    }
                }
        
                return { correctCount, incorrectCount, result };
            } catch (error) {
                console.error('Error checking answers:', error);
                throw error;
            }
          }
    }


export default PracticesService;