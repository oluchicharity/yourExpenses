// require("../models/userModel")

// const expenseValidation = (req, res, next) => {
//   const schema = Joi.object({
//     category: Joi.string().valid('Food', 'Transport', 'Utilities', 'Education').required(),
//     amount: Joi.number().required(),
//     description: Joi.string().optional()
//   });

//   const { error } = schema.validate(req.body);
//   if (error) {
//     return res.status(400).json(error.message);
//   }

//   next();
// };


// module.exports=expenseValidation
