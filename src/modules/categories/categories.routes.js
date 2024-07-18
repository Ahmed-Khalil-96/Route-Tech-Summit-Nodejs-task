import { Router } from "express";
import * as CC from "./categories.controller.js";
import { auth } from "../../Middlewares/auth.js";
import { validation } from "../../Middlewares/validation.js";
import * as CV from "./categories.validation.js";

const router = Router()
// ================================add category=========================================
router.post("/addCategory",auth(),validation(CV.addCategoryValidation),CC.addCategory);


//===============================update category=================================
router.patch("/update/:id",auth(),validation(CV.updateCategoryValidation),CC.updateCategory);


// ==============================delete category================================
router.delete("/delete/:id",auth(),validation(CV.deleteCatValid),CC.deleteCategory);


//=========================== get user own categories============================
router.get("/ownCategories",auth(),validation(CV.getUserOwnCategoriesValidation),CC.getUserOwnCategories);


//======================== get user own categories with filter========================
router.get("/ownCategoriesFilter",auth(),validation(CV.getUserOwnCategoriesWithFiltersValid),CC.getUserOwnCategoriesWithFilters);



// =============================get user own categories with sorting========================
router.get("/ownCategoriesSort",auth(),validation(CV.getUserOwnCategoriesWithSortingValid),CC.getUserOwnCategoriesSorting);

// ==========================get any user categories================================
router.get("/categories/:id",validation(CV.getUserCatsValidation),CC.getUserCats);


// =================================get any user categories with filter==========================
router.get("/categoriesFilter/:id",validation(CV.getUserCatsWithFilterValid),CC.getUserCatsWithFilter);


// ==============================get any user categories with sorting==================================
router.get("/categoriesSort/:id",validation(CV.getUserCatsWithSortValid),CC.getUserCatsWithSort);


export default router;