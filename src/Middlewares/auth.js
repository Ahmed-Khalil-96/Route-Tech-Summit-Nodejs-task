import jwt from "jsonwebtoken";
import userModel from "../../DB/Models/user.model.js";
import { asyncHandler } from "../utils/errorHandling.js";
import { AppError } from "../utils/errorClass.js";

export const auth = () => {
    return asyncHandler(async (req, res, next) => {
        const { token } = req.headers;
        if (!token) {
            return next(new AppError("Please login first", 401));
        }
        if (!token.startsWith(process.env.bearerKey)) {
            return next(new AppError("Invalid token", 401));
        }
        const newToken = token.split(process.env.bearerKey)[1];
        if (!newToken) {
            return next(new AppError("Please login first", 401));
        }
        const decoded = jwt.verify(newToken, process.env.authKey);
        if (!decoded?.email) {
            return next(new AppError("Invalid token", 401));
        }
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return next(new AppError("Invalid token", 401));
        }
        req.user = user;
        next();
    });
};
