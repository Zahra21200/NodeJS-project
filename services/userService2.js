const userModel = require("../model/userModel2");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {sendemail,resetpassword} =require("../utilites/sendouremail.js") 
const handleAsyncError =require("../utilites/handleAsyncError.js") ;

const signup = handleAsyncError(async (req, res) => {
    let checkEmail = await userModel.findOne({ email: req.body.email });

    if (checkEmail) {
      res.json("email is already found");
    } else {
        let hashpassword = bcrypt.hashSync(req.body.password, 10);
        let adduser = await userModel.insertMany({
          userName: req.body.userName,
            email: req.body.email,
            password: hashpassword,
            Adresse:req.body.Adresse,
          
    });
    let token=jwt.sign
    ({
      id:[0]._id},"verfication",
    )
    sendemail(req.body.email,{url:`http://localhost:7001/user/verify/${token}`})
        res.json({done:adduser});
}})


  const signin=handleAsyncError(async(req,res)=>{
    console.log(req.headers.authorization)
 
   let checkin=await userModel.findOne({ email:req.body.email});
   console.log(checkin);
   if(!checkin)
   return res.json({messge:"email is not found"})
let changhash=bcrypt.compareSync(req.body.password , checkin.password)
if(changhash){
  let token=jwt.sign({id:checkin._id,name:checkin.name},"hhhhhh") //hhhhh secrit key
  res.json({messge:"hello",token})
}else{
  res.json({messge:"passowrd not valid"})
}

})


const  forgetPassword=handleAsyncError(async(req,res)=>{
  let checkemail=await userModel.findOne({ email:req.body.email});
  if(checkemail){
  let data=checkemail
  console.log(data._id)
  await resetpassword(req.body.email,`http://localhost:7001/resetpassword/${data._id}`)
  res.json({message:"send verification to reset password"});
  }
else{
  return res.json({message:"email is not found"})
}
});

const addNewpassword=handleAsyncError(async(req,res)=>{
  console.log(req.body )
  let checkin=await userModel.findOne({ _id:req.params.id});
  console.log(req.params.id)
  if(!checkin) {
      res.json({message:"id not found"})
  }else {
    const passwordPattern = /^[A-Za-z][A-Za-z0-9]{3,8}$/;
    if (!passwordPattern.test(req.body.password)) {
      return res.json({ message: "Password must start with a letter and be 4-9 characters long" });
    }
    let hashpassword = bcrypt.hashSync(req.body.password, 10);
    console.log(hashpassword)

    checkin.password = hashpassword;
    await checkin.save(); 
    console.log(checkin.password)
      res.json({message:"done update Newpassword"})
  }
  
});
  module.exports={ 
    signup 
    ,
    signin
    ,
    forgetPassword
    ,
    addNewpassword
  };