import {Request, Response} from 'express';  
import {T} from "../libs/types/common";
import MemberService from '../schema/Member.service';
import { MemberInput } from '../libs/types/member';
import OpenAI from "openai";
import { AUTH_TIMER } from '../libs/config';
import { HttpCode } from '../libs/Errors';
import AuthService from '../schema/Auth.service';

export const memberController : T = {};
const memberService = new MemberService();
const authService = new AuthService();

memberController.goHome = (req: Request, res: Response) => {
    try {
        res.send("Welcome to EILTS Checker!");
    } catch(err){
        console.log(err);
    }
}

memberController.signup = async(req: Request, res: Response) => {
    try {
        const input:MemberInput = req.body;
        const result = await memberService.signup(input);
        const token = await authService.createToken(result);
        res.cookie("accessToken", token, {
            maxAge: AUTH_TIMER * 3600 * 1000,
            httpOnly: false
        })
  
        res.status(HttpCode.OK).json({member: result, accessToken: token});
    } catch(err){
        console.log("signup",err);
    }
}

memberController.login = async(req: Request, res: Response) => {
    try {
        const input: any = req.body,
        result = await memberService.login(input),
        token = await authService.createToken(result);
        res.cookie("accessToken", token, {
          maxAge: AUTH_TIMER * 3600 * 1000,
          httpOnly: false
        })

        res.status(HttpCode.CREATED).json({member: result, accessToken: token});
    } catch(err){
        console.log("signup",err);
    }
}
