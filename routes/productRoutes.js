const express= require('express');

const { getAllproductes,createproduct, getproduct,updateproduct,deleteproduct ,getProductsInCategory} = require('../services/productService');
const { getProductValidator,updateProductValidator,deleteProductValidator,createProductValidator,getCategoryProductsValidator } = require('../utilites/validators/productValidator');
const router=express.Router();

router.route('/').get(getAllproductes).post((req,res,next) =>{
    createProductValidator
    next()
}, createproduct);
router.route("/:id")
.get((req,res,next) =>{
    getProductValidator
    next()
},getproduct)
.put((req,res,next) =>{
    updateProductValidator
    next()
},updateproduct)
.delete((req,res,next) =>{
    deleteProductValidator
    next()
},deleteproduct);
router.route('/:categoryId').get((req,res,next) =>{
    getCategoryProductsValidator
    next()
}, getProductsInCategory);
module.exports=router;

