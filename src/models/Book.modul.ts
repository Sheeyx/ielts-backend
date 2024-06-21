import mongoose, {Schema} from "mongoose";

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    bookImages: {
        type: [String],
        default: []
    },
}, {timestamps: true});

export default mongoose.model("Book", bookSchema);