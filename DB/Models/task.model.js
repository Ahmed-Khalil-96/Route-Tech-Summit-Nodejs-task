import { model, Schema } from "mongoose";

const taskSchema = new Schema({
    content: {
        type: [""],
        required: true
    },
    isShared: {
        type: Boolean,
        default: false
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const taskModel = model("Task", taskSchema);

export default taskModel;
