const Joi = require('@hapi/joi');

const signupSchema = Joi.object({
    username : Joi.string().alphanum().required().min(4).max(10),
    email : Joi.string().email().required(),
    phone : Joi.string().regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
    password : Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
    .message('Your Password must contain At least one upper case English letter,At least one lower case English letter, At least one digit,At least one special character,Minimum eight in length')
    .required(),
    first_name : Joi.string().required().max(10),
    last_name : Joi.string().required()
});

const logSchema = Joi.object({
    username : Joi.string().required(),
    password : Joi.string().required()
});

module.exports = {
    signupSchema,
    logSchema
};