const Joi = require("@hapi/joi");

const validateCreateUser = (data) => {
    const schema = Joi.object({
        Firstname: Joi.string().trim().required().messages({
            'string.empty': 'Firstname cannot be empty.',
            'any.required': 'Firstname is required.',
        }),
        Lastname: Joi.string().trim().required().messages({
            'string.empty': 'Lastname cannot be empty.',
            'any.required': 'Lastname is required.',
        }),
        password: Joi.string().trim().min(8).required().messages({
            'string.empty': 'Password cannot be empty.',
            'string.min': 'Password must be at least {8} characters long.',
            'any.required': 'Password is required.',
        }),
        email: Joi.string().email().messages({
            'string.empty': 'Email cannot be empty.',
            'string.email': 'Please enter a valid email address.',
        }),
        
        
    });

    return schema.validate(data, { abortEarly: false });
};

const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email cannot be empty.',
            'string.email': 'Please enter a valid email address.',
            'any.required': 'Email is required.',
        }),
        password: Joi.string().required().messages({
            'string.empty': 'Password cannot be empty.',
            'any.required': 'Password is required.',
        }),
    });

    return schema.validate(data, { abortEarly: false });
};




module.exports = {
    validateCreateUser,
    validateLogin,
};
