import {Request, Response} from 'express';  
import {T} from "../libs/types/common";
import { OpenAI } from "openai";



export const writingController : T = {};


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

writingController.checkEssay = async (req:any, res:any) => {
    try {
        console.log(req.files);

        const question = req.body.question;
        const essayText = req.body.essayText;

        if (!question || !essayText) {
            return res.status(400).json({ error: "Essay question and text are required." });
        }

        const feedbackResponse = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are strict writing IELTS checker. Provide detailed feedback based on the following criteria: Overall Score, Grammar Assessment, Vocabulary Usage, Coherence and Cohesion Evaluation, Task Achievement Feedback, and General Comment."
                },
                {
                    role: "user",
                    content: `Provide detailed feedback on the following essay:\n\n${essayText}\n\nFeedback should include:\n- Overall Score\n- Grammar Assessment\n- Vocabulary Usage\n- Coherence and Cohesion Evaluation\n- Task Achievement Feedback\n- General Comment`
                }
            ],
            model: "gpt-3.5-turbo-16k",
            max_tokens: 500,
            temperature: 0.7,
        });
        
        if (!feedbackResponse.choices || feedbackResponse.choices.length === 0) {
            console.error("Error: Missing feedback content!");
            return;
        }
        
        const feedback = feedbackResponse.choices[0].message;
        console.log("feedback", feedback);
        
        const feedbackSections:any = {};
        const result:any = {};
        
        if (feedback && feedback.content) {
            const contentLines = feedback.content.split('\n');
            contentLines.filter(line => line.trim() !== '');
            contentLines.forEach(line => {
            const [key, ...value] = line.split(': ');
            result[key.replace(/\s+/g, '')] = value.join(': ');
            });  
        }       

        res.status(200).json({
            question: question,
            essay: essayText,
            feedback: result
        });
        
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while checking the essay." });
    }
};
