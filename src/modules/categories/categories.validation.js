import Joi from "joi";

export const addCategoryValidation = {
    body: Joi.object({
        name: Joi.string().required().messages({
            'any.required': 'Name is required',
        }),
        description: Joi.string().min(20).max(300).required().messages({
            'any.required': 'Description is required',
            'string.min': 'Description must be at least 20 characters long',
            'string.max': 'Description must be at most 300 characters long',
        })
    })
};

export const updateCategoryValidation = {
    body: Joi.object({
        name: Joi.string().required().min(3).max(30).messages({
            'any.required': 'Name is required',
            'string.min': 'Name must be at least 3 characters long',
            'string.max': 'Name must be at most 30 characters long',
        }),
        description: Joi.string().min(50).max(300).required().messages({
            'any.required': 'Description is required',
            'string.min': 'Description must be at least 50 characters long',
            'string.max': 'Description must be at most 300 characters long',
        })
    }),
    params: Joi.object({
        id: Joi.string().required().messages({
            'any.required': 'Id is required',
        })
    })
};

export const deleteCatValid = {
    params: Joi.object({
        id: Joi.string().required().messages({
            'any.required': 'Id is required',
        })
    })
};

export const getUserOwnCategoriesValidation = {
    query: Joi.object({
        page: Joi.number().required().messages({
            'any.required': 'Page is required',
        })
    })
};

export const getUserOwnCategoriesWithFiltersValid = {
    body: Joi.object({
        name: Joi.string().required().messages({
            'any.required': 'Name is required',
        }),
    }),
    query: Joi.object({
        page: Joi.number().required().messages({
            'any.required': 'Page is required',
        })
    })
};

export const getUserCatsValidation = {
    params: Joi.object({
        id: Joi.string().required().messages({
            'any.required': 'Id is required',
        })
    }),
    query: Joi.object({
        page: Joi.number().required().messages({
            'any.required': 'Page is required',
        })
    })
};

export const getUserCatsWithFilterValid = {
    body: Joi.object({
        name: Joi.string().required().messages({
            'any.required': 'Name is required',
        }),
    }),
    params: Joi.object({
        id: Joi.string().required().messages({
            'any.required': 'Id is required',
        })
    }),
    query: Joi.object({
        page: Joi.number().required().messages({
            'any.required': 'Page is required',
        })
    })
};

export const getUserCatsWithSortValid = {
    params: Joi.object({
        id: Joi.string().required().messages({
            'any.required': 'Id is required',
        })
    }),
    query: Joi.object({
        page: Joi.number().required().messages({
            'any.required': 'Page is required',
        }),
        sort: Joi.string().valid("asc", "desc").required().messages({
            'any.required': 'Sort is required',
            'any.only': 'Sort must be "asc" or "desc"',
        })
    })
};

export const getUserOwnCategoriesWithSortingValid = {
    query: Joi.object({
        page: Joi.number().required().messages({
            'any.required': 'Page is required',
        }),
        sort: Joi.string().valid("asc", "desc").required().messages({
            'any.required': 'Sort is required',
            'any.only': 'Sort must be "asc" or "desc"',
        })
    })
};
