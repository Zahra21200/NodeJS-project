const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");


const validationMidleware=(req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
};



const validation=(signSchema)=>{
  return(req,res,next)=>{
      let errors=signSchema.validate(req.body,{abortEarly:false});
      if(errors?.error){
          res.json({message:"Error",details:errors?.error?.details})
      }else{
      next()
      }      


  }
}
// const decodeddj=0;
const checktoken=()=>{
return(req,res,next)=>{
  const token =req.headers.authorization;
  // console.log(token)
  const secretKey = 'hhhhhh'; 
  
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      // console.error('JWT verification failed:', err);
      return res.json({messge:"error to token"})

    } else {
      next()
  //  console.log(token)
    }
  });

}};
module.exports={
  
  checktoken,
  validation,
  validationMidleware
};







 
