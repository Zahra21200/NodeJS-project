const express=require("express");
const dotenv=require("dotenv");
dotenv.config({path:'config.env'});
const morgan=require("morgan");
const dbConnection = require('./config/database')
const categoryRoutes=require('./routes/categoryRoutes');
const productRoutes=require('./routes/productRoutes');
const myErrors = require("./utilites/myErrors");
const glopalError = require("./middlewares/errorMiddleWare");
const userRouter = require( "./routes/userRoutes2")
const cartRouter = require( "./routes/cartRoutes")
 const router = require( "./routes/couponRoutes.js");
// const router = require("./routes/categoryRoutes");

//connect to data base
dbConnection();
//express app
const app=express();
//middlewares
app.use(express.json());
app.use(morgan("dev"));

//mount routes
app.use('/api/v1/categories',categoryRoutes);
app.use('/api/v1/productes',productRoutes);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/coupon', router);


app.all("*",(req,res,next)=>{
    // const error=new Error('can`t find this URL');
    // next(error.message);
    next(new myErrors("can`t find this URL",404))
});
//glopal error handling
app.use(glopalError)
const PORT=process.env.PORT ;
app.listen(8000,()=>{
    console.log(`app is running port ${PORT}`);
});

