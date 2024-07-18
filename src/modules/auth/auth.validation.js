import joi from "joi";



export const signUpValidation = {
    body: joi.object({
        name: joi.string().min(3).max(20).required().messages({
            "string.min": "Name must be at least 3 characters long",
            "string.max": "Name must be at most 20 characters long",
            "any.required": "Name is required"
        }),
        email: joi.string().email({ tlds: { allow: ['com', 'net'] }, maxDomainSegments: 3 }).required().messages({
            "string.email": "Email must be a valid email address",
            "any.required": "Email is required"
        }),
        password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")).required().messages({
            "string.pattern.base": "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character",
            "any.required": "Password is required"
        }),
        repeat_password: joi.string().valid(joi.ref("password")).required().messages({
            "any.only": "Passwords must match",
            "any.required": "Repeat password is required"
        })
    })
};

export const loginValidation = {
    body: joi.object({
        email: joi.string().email({ tlds: { allow: ['com', 'net'] }, maxDomainSegments: 3 }).required().messages({
            "string.email": "Email must be a valid email address",
            "any.required": "Email is required"
        }),
        password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")).required().messages({
            "string.pattern.base": "Password must be at least 8 characters long and contain at leastone lowercase letter, one uppercase letter, one number, and one special character",
            "any.required": "Password is required"
        })
    })
};

export const updatePasswordValid = {
    body: joi.object({
        email: joi.string().email({ tlds: { allow: ['net', 'com'] }, maxDomainSegments: 3 }).required().messages({
            "string.email": "Email is not valid",
            "any.required": "Email is required"
        }),
        newPassword: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required().messages({
            "string.pattern.base": "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one special character",
            "any.required": "Password is required"
        }),
        repeat_password: joi.string().valid(joi.ref("newPassword")).required().messages({
            "any.only": "Password must match",
            "any.required": "reapeat_password is required"
        }),
        otp: joi.string().length(6).required().messages({
            "string.length": "OTP must be 6 characters long",
            "any.required": "OTP is required"
        })
    })
};