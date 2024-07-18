import Joi from "joi";

export const addTaskValidation = {
    body: Joi.object({
        content: Joi.array().items(Joi.string().min(1).required()).required().messages({
            'string.empty': `Content is required`,
            'any.required': 'Content is required',
            'array.base': 'Content is required',
            'array.min': 'Content is required',
            'array.includes': 'Content is required'
        })
    }),
    params: Joi.object({
        categoryId: Joi.string().required().messages({
            'string.empty': `Id is required`
        })
    })
};

export const updateTaskValidation = {
    body: Joi.object({
        content: Joi.array().items(Joi.string().min(1).required()).required().messages({
            'string.empty': `Content is required`,
            'any.required': 'Content is required',
            'array.base': 'Content is required',
            'array.min': 'Content is required',
            'array.includes': 'Content is required'
        })
    }),
    params: Joi.object({
        taskId: Joi.string().required().messages({
            'string.empty': `Id is required`
        })
    })
};

export const deleteTaskValid = {
    params: Joi.object({
        taskId: Joi.string().required().messages({
            'string.empty': `Id is required`
        })
    })
};

export const shareTaskValidation = {
    params: Joi.object({
        taskId: Joi.string().required().messages({
            'string.empty': `Id is required`
        })
    })
};

export const unShareTaskValidation = {
    params: Joi.object({
        taskId: Joi.string().required().messages({
            'string.empty': `Id is required`
        })
    })
};

export const getCategorySharedTasksValid = {
    query: Joi.object({
        page: Joi.number().required().messages({
            'number.base': 'Page is required',
            'number.empty': 'Page is required'
        })
    }),
    params: Joi.object({
        categoryId: Joi.string().required().messages({
            'string.empty': `Id is required`
        })
    })
};

export const getSharedTasksWithFilterValid = {
    params: Joi.object({
        categoryId: Joi.string().required().messages({
            'string.empty': `Id is required`
        })
    }),
    query: Joi.object({
        page: Joi.number().required().messages({
            'number.base': 'Page is required',
            'number.empty': 'Page is required'
        }),
        isShared: Joi.boolean().required().messages({
            'boolean.base': 'isShared is required',
            'boolean.empty': 'isShared is required'
        })
    })
};

export const getAllOwnerTasksValid = {
    params: Joi.object({
        categoryId: Joi.string().required().messages({
            'string.empty': `Id is required`
        })
    }),
    query: Joi.object({
        page: Joi.number().required().messages({
            'number.base': 'Page is required',
            'number.empty': 'Page is required'
        })
    })
};

export const getAllOwnerTasksFilterValid = {
    params: Joi.object({
        categoryId: Joi.string().required().messages({
            'string.empty': `Id is required`
        })
    }),
    query: Joi.object({
        page: Joi.number().required().messages({
            'number.base': 'Page is required',
            'number.empty': 'Page is required'
        }),
        isShared: Joi.boolean().required().messages({
            'boolean.base': 'isShared is required',
            'boolean.empty': 'isShared is required'
        })
    })
};

export const getSharedTasksSortingValid = {
    query: Joi.object({
        page: Joi.number().required().messages({
            'number.base': 'Page is required',
            'number.empty': 'Page is required'
        }),
        sort: Joi.string().valid("asc", "desc").required().messages({
            'string.base': 'Sort is required',
            'string.empty': 'Sort is required',
            'string.valid': 'Sort must be asc or desc'
        })
    }),
    params: Joi.object({
        categoryId: Joi.string().required().messages({
            'string.empty': `Id is required`
        })
    })
};

export const getAllOwnerTasksSortingValid = {
    query: Joi.object({
        page: Joi.number().required().messages({
            'number.base': 'Page is required',
            'number.empty': 'Page is required'
        }),
        sort: Joi.string().valid("asc", "desc").required().messages({
            'string.base': 'Sort is required',
            'string.empty': 'Sort is required',
            'string.valid': 'Sort must be asc or desc'
        })
    }),
    params: Joi.object({
        categoryId: Joi.string().required().messages({
            'string.empty': `Id is required`
        })
    })
};
