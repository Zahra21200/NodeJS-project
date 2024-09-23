const { default: mongoose } = require("mongoose");
const schema = new mongoose.Schema({
    userName:{
        type:String,
        require:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
    password:{  
    type:String,  
    require:true
        },
        isVerified:{
            type:Boolean
            ,default:false
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
          },
        Adresse:[String],

},

{
    timestamps:true
}
)
const userModel =mongoose.model("User",schema);
module.exports=userModel;
