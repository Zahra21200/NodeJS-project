const express=require("express");

const {signup,signin,forgetPassword,addNewpassword}  = require("../services/userService2");
const { signupSchema,signinSchema } = require("../utilites/validators/userValidator2");
const {validation,checktoken} = require("../middlewares/validations");
const userRouter=express.Router();

userRouter.post("/signup",validation(signupSchema),signup)
userRouter.post("/signin",validation(signinSchema),signin)
userRouter.post("/forgetPassword",forgetPassword)
userRouter.put ("/resetpassword/:id",addNewpassword)



module.exports = userRouter;