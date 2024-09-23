const productModel = require("../model/productModel");
const slugify = require('slugify')
const asyncHandler =require('express-async-handler');
const myErrors = require("../utilites/myErrors");
const categorymodel = require("../model/categoryModel");

//get all productes
//http://localhost:8000/api/v1/productes?page=1&limit=3 (get)
exports.getAllproductes=asyncHandler(async (req,res)=>{
    const page=req.query.page*1||1;
    const limit=req.query.limit*1||5;
    const skip=(page-1)*limit;
   const allproductes =await productModel.find({}).skip(skip).limit(limit);
    res.status(200).json({result:allproductes.length,page,data:allproductes});
});
//get specific product
//http://localhost:8000/api/v1/productes/:id (get)
exports.getproduct=asyncHandler(async (req,res,next)=>{
    const {id}=req.params;
   const product =await productModel.findById(id);
   if(!product)
   {
        //res.status(404).json({msg:`there is no category for this id ${id}`})
       return  next(new myErrors(`there is no product for this id ${id}`,404));
   }
    res.status(200).json({data:product});
});
//add productes
//http://localhost:8000/api/v1/productes (post)
exports.createproduct=asyncHandler(async(req,res)=>{
      req.body.slug=slugify(req.body.productName);
    const product=await productModel.create(req.body );
     res.status(201).json({data:product});
});

//update productes
// http://localhost:8000/api/v1/productes/:id (put)
exports.updateproduct = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    req.body.slug=slugify(req.body.productName);

    

    try {
        const updatedproduct = await productModel.findOneAndUpdate(
            { _id: id },
            req.body,
            { new: true }
        );

        if (!updatedproduct) {
            return  next(new myErrors(`there is no product for this id ${id}`,404));
        }

        res.status(200).json({ data: updatedproduct });
    } catch (error) {
        // Handle any unexpected errors
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});


//delete productes
// http://localhost:8000/api/v1/productes/:id (delete)
exports.deleteproduct = asyncHandler(async (req, res,next) => {
    const { id } = req.params;

   
        const product = await productModel.findByIdAndDelete(id);

        if (!product) {
            return  next(new myErrors(`there is no product for this id ${id}`,404));
        }

        res.status(204).send();
});

// http://localhost:8000/api/v1/productes/:id (delete)
const productService = require('../services/productService'); // Adjust the path accordingly

exports.getProductsInCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  try {
    // Validate if categoryId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return next(new myErrors('Invalid Category ID', 400));
    }

    // Find all products in the specified category
    const productsInCategory = await productService.getProductsByCategory(categoryId);

    if (!productsInCategory || productsInCategory.length === 0) {
      return next(new myErrors(`No products found for category ID: ${categoryId}`, 404));
    }

    res.status(200).json({ result: productsInCategory.length, data: productsInCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});
