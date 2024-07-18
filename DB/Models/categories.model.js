import { model, Schema } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: "Task",
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const categoryModel = model("Category", categorySchema);

export default categoryModel;
