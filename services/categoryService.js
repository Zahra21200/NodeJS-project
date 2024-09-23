const categorymodel = require("../model/categoryModel");
const slugify = require('slugify')
const asyncHandler =require('express-async-handler');
const myErrors = require("../utilites/myErrors");

//get all categories
//http://localhost:8000/api/v1/categories?page=1&limit=3 (get)
exports.getAllCategory=asyncHandler(async (req,res)=>{
    const page=req.query.page*1||1;
    const limit=req.query.limit*1||5;
    const skip=(page-1)*limit;
   const allcategories =await categorymodel.find({}).skip(skip).limit(limit);
    res.status(200).json({result:allcategories.length,page,data:allcategories});
});
//get specific category
//http://localhost:8000/api/v1/categories/:id (get)
exports.getCategory=asyncHandler(async (req,res,next)=>{
    const {id}=req.params;
   const category =await categorymodel.findById(id);
   if(!category)
   {
        //res.status(404).json({msg:`there is no category for this id ${id}`})
       return  next(new myErrors(`there is no category for this id ${id}`,404));
   }
    res.status(200).json({data:category});
});
//add category
//http://localhost:8000/api/v1/categories (post)
exports.createCategory=(req,res)=>{
     const name =req.body.name;
    console.log(name);
    categorymodel.create({name,slug:slugify(name) }).then((category) =>
     res.status(201).json({data:category})
     )
     .catch((err)=>res.status(400).send(err));

}

//update category
// http://localhost:8000/api/v1/categories/:id (put)
exports.updateCategory = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const { name } = req.body;

    // Ensure 'name' is a string; handle other validations as needed
    if (typeof name !== 'string') {
        return res.status(400).json({ msg: 'Name should be a string' });
    }

    try {
        const updatedCategory = await categorymodel.findOneAndUpdate(
            { _id: id },
            { name,slug:slugify(name) },
            { new: true }
        );

        if (!updatedCategory) {
            return  next(new myErrors(`there is no category for this id ${id}`,404));
        }

        res.status(200).json({ data: updatedCategory });
    } catch (error) {
        // Handle any unexpected errors
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});


//delete category
// http://localhost:8000/api/v1/categories/:id (delete)
exports.deleteCategory = asyncHandler(async (req, res,next) => {
    const { id } = req.params;

   
        const Category = await categorymodel.findByIdAndDelete(id);

        if (!Category) {
            return  next(new myErrors(`there is no category for this id ${id}`,404));
        }

        res.status(204).send();
});