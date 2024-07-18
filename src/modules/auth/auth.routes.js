import { Router } from "express";
import * as UA from "./auth.js";
import { validation } from "../../Middlewares/validation.js";
import * as UV from "../users/user.validation.js";


const router = Router()



// =====================================signUp===========================================================================
router.post("/", validation(UV.signUpValidation), UA.signUp);

// =====================================================confirmEmail=========================================================================
router.get("/confirmEmail/:token", UA.confirmEmail);

// =====================================================refreshToken==========================================================
router.get("/refreshToken/:refToken", UA.refreshToken);

// =======================================================logIn================================================================
router.post("/login", validation(UV.loginValidation), UA.logIn);

// ===========================================logOut====================================================
router.get("/logout/:_id", UA.logOut);


// ====================================================forgetPassword================================================
router.post("/forgotPassword", UA.forgetPassword);

// ==================================================updatePassword=============================================
router.post("/updatePassword", validation(UV.updatePasswordValid), UA.updatePassword);


export default router