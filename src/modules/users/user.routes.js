import { Router } from "express";
import* as UC from "./user.controller.js";
import { validation } from "../../Middlewares/validation.js";
import * as UV from "./user.validation.js";
import { auth } from "../../Middlewares/auth.js";

const router = Router()

// =====================================signUp===========================================================================
router.post("/", validation(UV.signUpValidation), UC.signUp);

// =====================================================confirmEmail=========================================================================
router.get("/confirmEmail/:token", UC.confirmEmail);

// =====================================================refreshToken==========================================================
router.get("/refreshToken/:refToken", UC.refreshToken);

// =======================================================logIn================================================================
router.post("/login", validation(UV.loginValidation), UC.logIn);

// ===========================================logOut====================================================
router.get("/logout/:_id", UC.logOut);

// =====================================updateUser==================================================
router.patch("/update/:_id", auth(), validation(UV.updateUserValid), UC.updateUser);

// ==============================================deleteUser===================================================
router.delete("/:_id", auth(), UC.deleteUser);

// ====================================================forgetPassword================================================
router.post("/forgotPassword", UC.forgetPassword);

// ==================================================updatePassword=============================================
router.post("/updatePassword", validation(UV.updatePasswordValid), UC.updatePassword);

//============================================get user profile=======================================================
router.get("/getprofile", auth(), UC.getUserProfile);

// ==============================================get any user profile===================================
router.get("/getAnyprofile/:id", auth(),validation(UV.getAnyUserProfileValid), UC.getAnyUserProfile);

// =================================


export default router;