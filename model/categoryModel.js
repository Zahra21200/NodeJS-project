const { default: mongoose } = require("mongoose");

const mongoschema=new mongoose.Schema({
    name: {
        type:String,
        required:[true,"Category Name is Required"],
        unique:[true,"Category Name must be unique"],
        minlength: [3,"name is too short"],
        maxlength: [32,"name is too long"]
    },
     slug:{
        type:String,
        lowercase:true
     },
     image: {
        type: String  
    },
    createdBy: {
        type: String  
    }
},{timestamps:true});
const categorymodel=mongoose.model('category',mongoschema);
module.exports=categorymodel;
