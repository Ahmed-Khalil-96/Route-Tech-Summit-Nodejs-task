import { Router } from "express";
import { auth } from "../../Middlewares/auth.js";
import { validation } from "../../Middlewares/validation.js";
import * as TV from "./task.validation.js";
import * as TC from "./task.controller.js";

const router = Router()

// ============================================addTask=============================================
router.post("/:categoryId", auth(), validation(TV.addTaskValidation), TC.addTask);

// ============================================updateTask==========================================
router.patch("/update/:taskId", auth(), validation(TV.updateTaskValidation), TC.updateTask);

// ============================================deleteTask==========================================
router.delete("/:taskId", auth(), validation(TV.deleteTaskValid), TC.deleteTask);

// ============================================shareTask===========================================
router.patch("/shareTask/:taskId", auth(), validation(TV.shareTaskValidation), TC.updateTaskShared);

// ============================================unshareTask=========================================
router.patch("/unshareTask/:taskId", auth(), validation(TV.unShareTaskValidation), TC.unshareTask);

// ==============================get All shared tasks of user==================================
router.get("sharedTask/:categoryId",validation(TV.getCategorySharedTasksValid), TC.getCategorySharedTasks);


// ==============================get All tasks for any user with Filter============================
router.get("/tasksWithFilter/:categoryId", validation(TV.getSharedTasksWithFilterValid),TC.getSharedTasksWithFilter);


// =================================get All shared tasks of user use sorting==============================
router.get("/sharedTaskSorting/:categoryId", validation(TV.getSharedTasksSortingValid),TC.getSharedTasksSorting);


// ==============================get all category tasks for owner only=============================
router.get("/allTasks/:categoryId", auth(),validation(TV.getAllOwnerTasksValid), TC.getAllOwnerTasks);

// ==============================get all category tasks for owner with filter======================
router.get("/ownerTasksFilter/:categoryId",validation(TV.getAllOwnerTasksFilterValid), auth(), TC.getAllOwnerTasksFilter);



// ====================================get all category tasks for owner only use Sorting==========================
router.get("/allTasksSorting/:categoryId", auth(),validation(TV.getAllOwnerTasksSortingValid),TC.getAllOwnerTasksSorting);

export default router;
