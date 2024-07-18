import categoryModel from "../../../DB/Models/categories.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import {AppError} from "../../utils/errorClass.js"
import taskModel from "../../../DB/Models/task.model.js";




//=============================================addTask=============================================
// 1. Extract categoryId from params and content from body
// 2. Find the category by categoryId
// 3. Check if the category exists and if the user is authorized
// 4. Create the task with the provided content and categoryId
// 5. Update the category to include the new task
// 6. Respond with the created task
export const addTask = asyncHandler(async(req,res,next)=>{
    const {categoryId}= req.params
    const {content}=req.body

    const category = await categoryModel.findById(categoryId)
    if(!category) return next(new AppError("category not found",404))
    if(req.user.id!=category.user){
        return next(new AppError("you are not authorized to add task in this category",401))
    }
    const task = await taskModel.create({content,category:categoryId})
    await categoryModel.findByIdAndUpdate(categoryId,{$push:{tasks:task._id}})
    res.status(201).json({task ,message:"task added successfully"})
})

// ================================================updateTask=====================================
// 1. Extract taskId from params and content from body
// 2. Find the task by taskId
// 3. Check if the task exists and if the user is authorized
// 4. Update the task with the new content
// 5. Respond with the updated task
export const updateTask = asyncHandler(async(req,res,next)=>{
    const {taskId}=req.params
    const {content}= req.body

    const taskExist = await taskModel.findById(taskId)
    if(!taskExist) return next(new AppError("task not found",404))

        const category = await categoryModel.findById(taskExist.category)
        if(category.user!=req.user.id){
            return next(new AppError("you are not authorized to update this task",401))
        }
       const updatedTask = await taskModel.findByIdAndUpdate(taskId,{content},{new:true})
       return res.status(200).json({updatedTask,message:"task updated successfully"})
})


// ================================================deleteTask=====================================
// 1. Extract taskId from params
// 2. Find the task by taskId
// 3. Check if the task exists and if the user is authorized
// 4. Remove the task from the category
// 5. Delete the task
// 6. Respond with a success message
export const deleteTask = asyncHandler(async(req,res,next)=>{
    const {taskId}=req.params
   
    const taskExist = await taskModel.findById(taskId)
    if(!taskExist) return next(new AppError("task not found",404))

        const category = await categoryModel.findById(taskExist.category)
        if(category.user!=req.user.id){
            return next(new AppError("you are not authorized to delete this task",401))
        }
    await categoryModel.findByIdAndUpdate(taskExist.category,{$pull:{tasks:taskId}})
       const deletedTask = await taskModel.findByIdAndDelete(taskId)
       if(deletedTask.deletedCount==0)
        return next(new AppError("something went wrong please try again",400))
       
       return res.status(200).json({message:"task deleted successfully"})
})


// ==================================shareTask========================================================
// 1. Extract taskId from params
// 2. Find the task by taskId
// 3. Check if the task exists and if the user is authorized
// 4. Check if the task is already shared
// 5. Update the task to set isShared to true
// 6. Respond with the updated task
export const updateTaskShared = asyncHandler(async(req,res,next)=>{
    const {taskId}=req.params
    const taskExist = await taskModel.findById(taskId)
    if(!taskExist) return next(new AppError("task not found",404))

        const category = await categoryModel.findById(taskExist.category)
        if(category.user!=req.user.id){
            return next(new AppError("you are not authorized to update this task",401))
        }
        
        if(taskExist.isShared){
            return next(new AppError("This task is already shared",409))
        }
        const updatedTask = await taskModel.findByIdAndUpdate(taskId,{isShared:true},{new:true})

        return res.status(200).json({updatedTask,message:"task is now shared"})
})


// =====================================unshareTask================================================
// 1. Extract taskId from params
// 2. Find the task by taskId
// 3. Check if the task exists and if the user is authorized
// 4. Check if the task is already private
// 5. Update the task to set isShared to false
// 6. Respond with the updated task
export const unshareTask = asyncHandler(async(req,res,next)=>{
    const {taskId}=req.params
    const taskExist = await taskModel.findById(taskId)
    if(!taskExist) return next(new AppError("task not found",404))
        const category = await categoryModel.findById(taskExist.category)
    if(category.user!=req.user.id){
        return next(new AppError("you are not authorized to update this task",401))
        }
        if(!taskExist.isShared){
            return next(new AppError("This task is already private",409))
        }
        const updatedTask = await taskModel.findByIdAndUpdate(taskId,{isShared:false},{new:true})
        return res.status(200).json({updatedTask,message:"task is now private"})
        })

// ===================================get All shared tasks of user ==============================================================
// 1. Extract page and categoryId from query and params
// 2. Set limit and calculate skip for pagination
// 3. Find the category by categoryId
// 4. Check if the category exists
// 5. Find tasks that are shared and belong to the category
// 6. Respond with the tasks

export const getCategorySharedTasks = asyncHandler(async(req,res,next)=>{
    const {page}=req.query
    const limit = 5
    const skip = (page-1)*limit

const {categoryId}=req.params
    const category = await categoryModel.findById(categoryId)
    if(!category) return next(new AppError("category not found",404))
    const tasks = await taskModel.find({$and:[{category:categoryId},{isShared:true}]}).populate("category").limit(limit).skip(skip)
    if(tasks.length==0){
        return next(new AppError("no tasks found",404))
    }
    res.status(200).json({tasks})
})
// ===================================get All tasks for any user with Filter (shared tasks)==============================================================
// 1. Extract isShared, page, and categoryId from query and params
// 2. Set limit and calculate skip for pagination
// 3. Check if isShared is true
// 4. Find the category by categoryId
// 5. Check if the category exists
// 6. Find tasks that are shared and belong to the category
// 7. Respond with the tasks

export const getSharedTasksWithFilter = asyncHandler(async(req,res,next)=>{
    
    const {isShared}=req.query
    const {page}=req.query
    const limit = 5
    const skip = (page-1)*limit
    const {categoryId}=req.params

if(isShared==true){
    const category = await categoryModel.findById(categoryId)
    if(!category) return next(new AppError("category not found",404))
    const tasks = await taskModel.find({$and:[{category:categoryId},{isShared}]}).populate("category").limit(limit).skip(skip)
    if(tasks.length==0){
        return next(new AppError("no tasks found",404))
    }
     return res.status(200).json({tasks})
}
    return next(new AppError("you are not authorized to view private tasks for this category",400))

})


// ===================================get All shared tasks of user use sorting ==============================================================
// ===================================get All shared tasks of user use sorting ===============================================
// 1. Extract sort and page from query parameters
// 2. Set limit and calculate skip for pagination based on the page parameter
// 3. Extract categoryId from params
// 4. Validate if sort is 'asc'; if true, proceed to find shared tasks in ascending order
//    a. Find the category by categoryId using categoryModel.findById()
//    b. If category not found, return a 404 error using next(new AppError())
//    c. Retrieve tasks that belong to the category and are shared (isShared:true)
//    d. Sort tasks by the isShared field in ascending order
//    e. Populate the category field in the tasks using populate("category")
//    f. Limit the number of tasks returned per page using limit() and calculate the skip based on the page and limit values
//    g. If no tasks are found, return a 404 error using next(new AppError())
//    h. Respond with the retrieved tasks in JSON format along with a 200 status code
// 5. If sort is 'desc', return a 500 error using next(new AppError()) indicating not authorized to view private tasks

export const getSharedTasksSorting = asyncHandler(async(req, res, next) => {
    const { sort } = req.query;
    const { page } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;

    const { categoryId } = req.params;

    if (sort.toLowerCase() === 'desc') {
        const category = await categoryModel.findById(categoryId);
        if (!category) return next(new AppError("category not found", 404));
        const tasks = await taskModel.find({ $and: [{ category: categoryId }, { isShared: true }] }, null, { sort: { isShared: sort } }).populate("category").limit(limit).skip(skip);
        if (tasks.length == 0) {
            return next(new AppError("no tasks found", 404));
        }
        res.status(200).json({ tasks });
    } else if (sort.toLowerCase() === 'asc') {
        return next(new AppError("you are not authorized to view the private tasks of this user", 500));
    }
});


// ==================================get all category tasks for owner only ===================================================================
// 1. Extract categoryId from params and page from query
// 2. Set limit and calculate skip for pagination
// 3. Find the category by categoryId
// 4. Check if the category exists and if the user is authorized
// 5. Find tasks that belong to the category
// 6. Respond with the tasks
export const getAllOwnerTasks = asyncHandler(async(req, res, next) => {
    const { categoryId } = req.params;
    const { page } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;

    const category = await categoryModel.findById(categoryId);
    if (!category) return next(new AppError("category not found", 404));
    if (req.user.id != category.user) {
        return next(new AppError("you are not authorized to view this category", 401));
    }
    const tasks = await taskModel.find({ category }).limit(limit).skip(skip);
    if (tasks.length == 0) {
        return next(new AppError("no tasks found", 404));
    }
    res.status(200).json({ tasks });
});


// ==================================get all category tasks for owner with filter ===================================================================
// 1. Extract categoryId from params, isShared and page from query
// 2. Set limit and calculate skip for pagination
// 3. Find the category by categoryId
// 4. Check if the category exists and if the user is authorized
// 5. Find tasks that belong to the category and match the isShared filter
// 6. Respond with the tasks
export const getAllOwnerTasksFilter = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    const { isShared } = req.query;
    const { page } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;

    const category = await categoryModel.findById(categoryId);
    if (!category) return next(new AppError("category not found", 404));
    if (req.user.id != category.user) {
        return next(new AppError("you are not authorized to view this category", 401));
    }
    const tasks = await taskModel.find({ $and: [{ category }, { isShared }] }).limit(limit).skip(skip);
    if (tasks.length == 0) {
        return next(new AppError("no tasks found", 404));
    }
    res.status(200).json({ tasks });
});


// ==================================get all category tasks for owner only use Sorting ===================================================================

// 1. Extract categoryId from params, sort and page from query parameters
// 2. Set limit and calculate skip for pagination based on the page parameter
// 3. Find the category by categoryId using categoryModel.findById()
// 4. Check if the category exists; if not, return a 404 error using next(new AppError())
// 5. Verify if the authenticated user is authorized to view this category; if not, return a 401 error
// 6. Retrieve tasks belonging to the category sorted based on the isShared field, ascending or descending based on the sort parameter
// 7. Limit the number of tasks returned per page using limit() and calculate the skip based on the page and limit values
// 8. If no tasks are found, return a 404 error using next(new AppError())
// 9. Respond with the retrieved tasks in JSON format along with a 200 status code
// 10. if sorted as asc it sorts the tasks from private(isShared:false)to shared(isShared:true)

export const getAllOwnerTasksSorting = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    const { sort } = req.query;
    const { page } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;

    const category = await categoryModel.findById(categoryId);
    if (!category) return next(new AppError("category not found", 404));
    if (req.user.id != category.user) {
        return next(new AppError("you are not authorized to view this category", 401));
    }
    const tasks = await taskModel.find({ category }, null, { sort: { isShared: sort } }).limit(limit).skip(skip);
    if (tasks.length == 0) {
        return next(new AppError("no tasks found", 404));
    }
    res.status(200).json({ tasks });
});



