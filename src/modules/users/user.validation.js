import joi from "joi";


export const updateUserValid = {
    body: joi.object({
        name: joi.string().min(3).max(30).messages({
            "string.min": "Name must be at least 3 characters long",
            "string.max": "Name must be at most 30 characters long"
        }),
        email: joi.string().email({ tlds: { allow: ['com', 'net'] }, maxDomainSegments: 3 }).messages({
            "string.email": "Email must be a valid email address"
        })
    })
};



export const getAnyUserProfileValid = {
    params: joi.object({
        userId: joi.string().required().messages({
            "any.required": "User ID is required"
        })
    })
};
