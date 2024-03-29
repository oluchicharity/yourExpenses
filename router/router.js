

const express= require("express")
// const{ category }=require("../controller/categoryController")
// const{ auth,isAdmin }= require("../middleware/authentication")

 const{ createUser, login, getAll, getOne, updateUser, category, getCategory, makeAdmin,verify, deleteUser, totalExpense, deleteExpense, deleteCategory ,resendOTP}= require('../controller/controller')
// const { verify } = require("jsonwebtoken")


 const router= express.Router()

 router.post('/createUser',createUser )
 router.post('/login', login)
 router.get('/getAll', getAll)
 router.get('/getOne/:id', getOne)
 router.put('/updateUser/:id', updateUser)
 router.post('/updateCategory/:id', category)
router.get("/getCategory/:id/:expenses", getCategory)
router.put("/makeAdmin/:id", makeAdmin)
router.get("/resendOtp/:id",resendOTP )
//verify should be a get method
router.post("/verify/:id", verify)
router.get("/totalAmount/:id", totalExpense)
// router.delete("/deleteCategory/:id/:arrayIndex", deleteCategory)
router.delete("/deleteUser/:id", deleteUser)

 module.exports= router