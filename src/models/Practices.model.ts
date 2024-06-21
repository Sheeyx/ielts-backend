import mongoose, {Schema} from "mongoose";
import { PracticeType } from "../libs/enums/book";

const practicesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    audio: {
        type: [String],
        required: false
    },
    practicesImage: {
        type: [String],
        default: []
    },
    practiceType: {
        type: String,
        enum: PracticeType,
        required: true
    },
    bookId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Book",
    },
}, {timestamps: true});

export default mongoose.model("Practices", practicesSchema);