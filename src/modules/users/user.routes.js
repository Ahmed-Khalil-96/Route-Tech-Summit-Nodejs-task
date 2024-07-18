import { Router } from "express";
import* as UC from "./user.controller.js";
import { validation } from "../../Middlewares/validation.js";
import * as UV from "./user.validation.js";
import { auth } from "../../Middlewares/auth.js";

const router = Router()


// =====================================updateUser==================================================
router.patch("/update/:_id", auth(), validation(UV.updateUserValid), UC.updateUser);

// ==============================================deleteUser===================================================
router.delete("/:_id", auth(), UC.deleteUser);
//============================================get user profile=======================================================
router.get("/getprofile", auth(), UC.getUserProfile);

// ==============================================get any user profile===================================
router.get("/getAnyprofile/:id", auth(),validation(UV.getAnyUserProfileValid), UC.getAnyUserProfile);

// =================================


export default router;