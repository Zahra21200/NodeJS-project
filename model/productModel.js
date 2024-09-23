const { default: mongoose } = require("mongoose");

const productSchema=new mongoose.Schema({
    productName: {
        type:String,
        trim:true,
        required:true,
        unique:true,
        minlength: [3,"name is too short"],
        maxlength: [32,"name is too long"]
    },
     slug:{
        type:String,
        lowercase:true,
        required:true
     },
     image: {
        type: String, 
    },
    priceAfterDiscount: {
        type: Number 
    },
    finalPrice: {
        type: Number , 
        required:true,
        max: [32,"price is too long"]

    },
    category: {
        type: mongoose.Schema.ObjectId ,
        ref:'category',
        required:true
    },
    stock: {
        type: Number, 
    },
},{timestamps:true});
const productmodel=mongoose.model('product',productSchema);
module.exports=productmodel;
