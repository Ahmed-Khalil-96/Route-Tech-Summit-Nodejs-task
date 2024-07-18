import userModel from "../../../DB/Models/user.model.js"
import jwt from "jsonwebtoken"
import sendEmail from "../../services/sendEmail.js"
import bcrypt from"bcrypt"
import { asyncHandler } from "../../utils/errorHandling.js"
import { AppError } from "../../utils/errorClass.js"
import { nanoid } from "nanoid"
import categoryModel from "../../../DB/Models/categories.model.js"
import taskModel from "../../../DB/Models/task.model.js"









 // =====================================updateUser==================================================
 // 1. Extract _id from request parameters
// 2. Check if user is allowed to update (authorization)
// 3. Extract name and email from request body
// 4. Find user by _id
// 5. Check if email already exists
// 6. Update user information
// 7. Respond with success message
export const updateUser = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    if (_id !== req.user.id) {
        next(new AppError("You are not allowed to update this user", 400));
    }
    const { name, email } = req.body;
    const user = await userModel.findOne({ _id });
    if (!user) {
        next(new AppError("User not found", 400));
    }
    const emailExists = await userModel.findOne({ email });
    if (emailExists && emailExists._id.toString() !== _id) {
        next(new AppError("Email already exists", 400));
    }
    await userModel.updateOne({ _id }, { name, email });
    return res.status(200).json({ message: "User is updated successfully" });
});



// ==============================================deleteUser===================================================
// 1. Extract _id from request parameters
// 2. Check if user is allowed to delete (authorization)
// 3. Find user by _id
// 4. Find categories belonging to the user
// 5. Delete categories and associated tasks
// 6. Delete user
// 7. Respond with success message
export const deleteUser = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    if (_id !== req.user.id) {
        next(new AppError("You are not allowed to delete this user", 400));
    }
    const user = await userModel.findOne({ _id });
    if (!user) {
        next(new AppError("User not found", 400));
    }

    const categories = await categoryModel.find({ user: _id }).select("_id");

    if (!categories.length) {
        next(new AppError("No categories found", 400));
    }

    const categoriesIds = categories.map(category => category._id.toString());

    await categoryModel.deleteMany({ user: _id });

    await taskModel.deleteMany({ category: { $in: categoriesIds } });

    const deletedUser = await userModel.deleteOne({ _id });
    if (!deletedUser) {
        next(new AppError("Something went wrong, please try again", 400));
    }

    return res.status(200).json({ message: "User is deleted successfully" });
});



// ====================================================forgetPassword================================================
// 1. Extract email from request body
// 2. Find user by email
// 3. Generate OTP
// 4. Send email with OTP
// 5. Update user document with OTP
// 6. Respond with success message

export const forgetPassword = asyncHandler(async(req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
        return next(new AppError("user not found", 404));
    }
    const otp = nanoid(6);
    const data = sendEmail(email, "reset your password ", `<p>please use this otp to reset your password ${otp}</p>`);
    if (!data) {
        return next(new AppError("email not sent", 500));
    }
    const update = await userModel.updateOne({ email }, { otp });
    if (!update) {
        return next(new AppError("something went wrong, please try again later", 400));
    }
    return res.status(200).json({ message: "otp is sent to your email" });
});

    

// ==================================================updatePassword=============================================
// 1. Extract email, OTP, and newPassword from request body
// 2. Find user by email
// 3. Compare OTP
// 4. Hash newPassword and update user password
// 5. Remove OTP from user document
// 6. Respond with success message
export const updatePassword = asyncHandler(async(req, res, next) => {
    const { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new AppError("user not found", 404));
    }
    if (user.otp !== otp) {
        return next(new AppError("otp is not correct", 400));
    }
    const hash = bcrypt.hashSync(newPassword, Number(process.env.saltRounds));

    const updatedPassword = await userModel.updateOne({ email }, { password: hash, $unset: { otp: "" } });
    if (!updatedPassword) {
        return next(new AppError("something went wrong, please try again later", 400));
    }
    return res.status(200).json({ message: "password is updated successfully" });
});


//============================================get user profile=======================================================
// 1. Find user profile based on authenticated user's id
// 2. Find categories belonging to the user
// 3. Respond with user's name, email, and categories

export const getUserProfile = asyncHandler(async (req, res, next) => {
    const user = await userModel.findOne({ _id: req.user.id });
    if (!user) {
        return next(new AppError("user not found", 404));
    }

    const categories = await categoryModel.find({ user: req.user.id }).select("name description");
    return res.status(200).json({ name: user.name, email: user.email, categories });
});


// ==============================================get any user profile===================================
// 1. Extract id from request parameters
// 2. Find user profile based on provided id
// 3. Populate categories belonging to the user
// 4. Respond with user's name, email, and categories
export const getAnyUserProfile = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel.findOne({ _id: id }).populate({
        path: "categories",
        select: "name _id"
    });
    if (!user) {
        return next(new AppError("user not found", 404));
    }
    const categories = await categoryModel.find({ user: id }).select("name description");
    return res.status(200).json({ name: user.name, email: user.email, categories });
});
