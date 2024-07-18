import { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    categories: [{
        type: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        }
    }],
    isConfirmed: {
        type: Boolean,
        default: false
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
    }
}, {
    timestamps: true,
    versionKey: false
});

const userModel = model("User", userSchema);

export default userModel;
