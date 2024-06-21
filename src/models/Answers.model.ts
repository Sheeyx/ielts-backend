import mongoose, {Schema} from "mongoose";

const answersSchema = new Schema({
    answers: {
        type: [String],
        required: true
    },
    practiceId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Practices",
    },
}, {timestamps: true});

export default mongoose.model("Answers", answersSchema);