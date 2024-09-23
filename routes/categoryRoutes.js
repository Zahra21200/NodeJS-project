const express= require('express');
const { getAllCategory,createCategory, getCategory,updateCategory,deleteCategory } = require('../services/categoryService');
const { getCategoryValidator,updateCategoryValidator,deleteCategoryValidator,createCategoryValidator } = require('../utilites/validators/categoryValidator');
const router=express.Router();
router.route('/').get((req,res,next)=>{

    next()
},getAllCategory)
.post((req,res,next) =>{
    createCategoryValidator
    next()
}, createCategory);
router.route("/:id").get((req,res,next) =>{
    getCategoryValidator
    next()
},getCategory)
.put((req,res,next) =>{
    updateCategoryValidator
    next()
},updateCategory)
.delete((req,res,next) =>{
    deleteCategoryValidator
    next()
},deleteCategory);
module.exports=router;