const { default: mongoose } = require("mongoose")

const dbConnection=()=>{

    mongoose.connect("mongodb://localhost:27017/e-commerceProject")
    .then((conn)=>{
        console.log('connected');
    }).catch((err)=>{
        console.log('not connected');
        process.exit(1);
    });
};

module.exports= dbConnection;