import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberStatus } from "../libs/enums/member";
import { MemberInput } from "../libs/types/member";
import MemberModel from "../models/Member.model";



class MemberService {
    private readonly memberModel;
    constructor(){
        this.memberModel = MemberModel;
    }

    public async signup(input:MemberInput):Promise<any>{
        console.log(input, "hello");
        try {
            const result = await this.memberModel.create(input);
            result.memberPassword = "";
            console.log(result, "result");
            
            return result.toJSON();
        } catch (err) {
            console.log(err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
            
        }
        
    }

    public async login(input:MemberInput):Promise<any>{
        const member = await this.memberModel.findOne(
            {
                memberNick: input.memberNick,
                memberStatus: {$ne: MemberStatus.DELETE}
            },
            {
                memberNick: 1, memberPassword: 1, memberStatus: 1
            }
        )

        if(!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK)
            else if(member.memberStatus === MemberStatus.BLOCK){
                throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER)
            }

        return await this.memberModel.findById(member._id).lean().exec();            
    }
}

export default MemberService;