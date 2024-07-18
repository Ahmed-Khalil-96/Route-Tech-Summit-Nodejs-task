import categoryModel from "../../../DB/Models/categories.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import {AppError} from "../../utils/errorClass.js"
import userModel from "../../../DB/Models/user.model.js";
import taskModel from "../../../DB/Models/task.model.js";




// ===========================================add category=====================================================
// 1. Extract name and description from body
// 2. Create a new category with the provided name and description, associating it with the user
// 3. Check if the category was created successfully
// 4. Update the user to include the new category
// 5. Respond with the created category
export const addCategory = asyncHandler(async(req, res, next) => {
    const { name, description } = req.body;
    const category = await categoryModel.create({ name, description, user: req.user.id });
    if (!category) {
        return next(new AppError("something went wrong, please try again", 400));
    }
    await userModel.findByIdAndUpdate(req.user.id, { $push: { categories: category._id } });
    res.status(201).json({ msg: "category is created successfully", category });
});

// =========================================update category===================================================
// 1. Extract categoryId from params and name, description from body
// 2. Find the category by categoryId
// 3. Check if the category exists and if the user is authorized
// 4. Update the category with the new name and description
// 5. Respond with the updated category
export const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const categoryExist = await categoryModel.findById(id);
    if (!categoryExist) {
        return next(new AppError("category does not exist", 404));
    }
    if (req.user.id != categoryExist.user) {
        return next(new AppError("you are not authorized to perform this action", 403));
    }
    const category = await categoryModel.findByIdAndUpdate(id, { name, description }, { new: true });
    res.status(200).json({ msg: "category is updated successfully", category });
});

// ========================================delete category=====================================================
// 1. Extract categoryId from params
// 2. Find the category by categoryId
// 3. Check if the category exists and if the user is authorized
// 4. Remove the category from the user
// 5. Delete all tasks associated with the category
// 6. Delete the category
// 7. Respond with a success message
export const deleteCategory = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    const categoryExist = await categoryModel.findById(categoryId);
    if (!categoryExist) {
        return next(new AppError("category does not exist", 404));
    }
    if (req.user.id != categoryExist.user) {
        return next(new AppError("you are not authorized to perform this action", 403));
    }

    await userModel.findByIdAndUpdate(categoryExist.user, { $pull: { categories: categoryId } });

    await taskModel.deleteMany({ category: categoryId });

    const category = await categoryModel.deleteOne({ _id: categoryId });
    if (category.deletedCount == 0) {
        return next(new AppError("something went wrong, please try again", 400));
    }
    res.status(200).json({ msg: "category is deleted successfully" });
});


// =======================================get user own categories==========================================
// 1. Extract page from query for pagination
// 2. Set limit and calculate skip for pagination
// 3. Find categories that belong to the user
// 4. Check if there are any categories
// 5. Respond with the categories
export const getUserOwnCategories = asyncHandler(async (req, res, next) => {
    const { page } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;
    const categories = await categoryModel.find({ user: req.user.id }).limit(limit).skip(skip);
    if (categories.length === 0) {
        return next(new AppError("you have no categories", 404));
    }
    res.status(200).json({ msg: "categories are fetched successfully", categories });
});


// =======================================get user own categories with filter ==========================================
// 1. Extract name from body and page from query for pagination
// 2. Set limit and calculate skip for pagination
// 3. Find categories that belong to the user and match the name filter
// 4. Check if there are any categories
// 5. Respond with the categories
export const getUserOwnCategoriesWithFilters = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const { page } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;
    const categories = await categoryModel.find({ $and: [{ name }, { user: req.user.id }] }).limit(limit).skip(skip);
    if (categories.length === 0) {
        return next(new AppError("you have no categories", 404));
    }
    res.status(200).json({ msg: "categories are fetched successfully", categories });
});

// =======================================get user own categories with sorting==========================================
// 1. Extract sorting parameter 'sort' from query
// 2. Extract pagination parameter 'page' from query
// 3. Set pagination limit and calculate skip
// 4. Find categories that belong to the current user
// 5. Sort categories based on the 'name' field in ascending or descending order based on the 'sort' parameter
// 6. Limit the number of categories fetched using 'limit' and skip certain number of documents using 'skip'
// 7. Check if any categories are found; if not, return a 404 error
// 8. Respond with a success message and the fetched categories

export const getUserOwnCategoriesSorting = asyncHandler(async (req, res, next) => {
    const { sort } = req.query;
    const { page } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;
    const categories = await categoryModel.find({ user: req.user.id }, null, { sort: { name: sort } }).limit(limit).skip(skip);
    if (categories.length === 0) {
        return next(new AppError("you have no categories", 404));
    }
    res.status(200).json({ msg: "categories are fetched successfully", categories });
});




// ===============================get any user categories====================================================
// 1. Extract userId from params and page from query for pagination
// 2. Set limit and calculate skip for pagination
// 3. Find categories that belong to the user
// 4. Check if there are any categories
// 5. Respond with the categories

export const getUserCats = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { page } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;
    const categories = await categoryModel.find({ user: id }).limit(limit).skip(skip);
    if (categories.length === 0) {
        return next(new AppError("user has no categories", 404));
    }
    res.status(200).json({ msg: "categories are fetched successfully", categories });
});

// ===============================get any user categories with filter ====================================================
// 1. Extract name from body, userId from params, and page from query for pagination
// 2. Set limit and calculate skip for pagination
// 3. Find categories that belong to the user and match the name filter
// 4. Check if there are any categories
// 5. Respond with the categories

export const getUserCatsWithFilter = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;
    const { page } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;
    const categories = await categoryModel.find({ $and: [{ user: id }, { name }] }).limit(limit).skip(skip);
    if (categories.length === 0) {
        return next(new AppError("user has no categories", 404));
    }
    res.status(200).json({ msg: "categories are fetched successfully", categories });
});



// ===============================get any user categories with sorting====================================================
// 1. Extract user ID parameter 'id' from params
// 2. Extract sorting parameter 'sort' from query
// 3. Extract pagination parameter 'page' from query
// 4. Set pagination limit and calculate skip
// 5. Find categories that belong to the specified user ID
// 6. Sort categories based on the 'name' field in ascending or descending order based on the 'sort' parameter
// 7. Limit the number of categories fetched using 'limit' and skip certain number of documents using 'skip'
// 8. Check if any categories are found; if not, return a 404 error
// 9. Respond with a success message and the fetched categories
export const getUserCatsWithSort = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { sort } = req.query;
    const { page } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;
    const categories = await categoryModel.find({ user: id }, null, { sort: { name: sort } }).limit(limit).skip(skip);
    if (categories.length === 0) {
        return next(new AppError("user has no categories", 404));
    }
    res.status(200).json({ msg: "categories are fetched successfully", categories });
});

