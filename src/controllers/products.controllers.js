import {getProducts,getProductById,addProduct,updateProduct,getProductCategory,filterProducts,deleteProduct,searchProducts} from "../models/products.models.js";
import {body,validationResult} from "express-validator";
//Obtener todos los productos
export const getProductsController = async (req, res, next) => {
  try {
    const products = await getProducts();

    if (products.length === 0) {
      const error = new Error("La colección de productos está vacía");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
//Obtener un producto determinado
export const getProductByIdController=async(req,res,next)=>{
  try{
    const {id}=req.params;
    const product=await getProductById(id);
    res.json(product)
  }catch(error){
    next(error)
  }
}
//Agregar un nuevo producto
export const addProductController=[
  body("title")
  .trim()
  .notEmpty().withMessage("Completar este campo")
  .isLength({min:3,max:25}).withMessage("Debe contener entre 3 y 25 caractéres"),
  body("price")
  .trim()
  .notEmpty().withMessage("Completar este campo")
  .isNumeric().withMessage("Debe contener valores nunéricos"),
  body("category")
  .trim()
  .notEmpty().withMessage("Cmpletar este campo")
  .isLength({min:5,max:20}).withMessage("Debe contener entre 5 y 20 caractéres"),
  body("description")
  .trim()
  .notEmpty().withMessage("Completar este campo")
  .isLength({min:5,max:100}).withMessage("Debe contener entre 5 y 100 caractéres"),
  async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      res.status(400).json({errors:errors.array()})
    }
  try{
    const product=await addProduct(req.body);
    res.json(product)
  }catch(error){
    next(error)
  }
}]
//Actualizar un producto específico
export const updateProductController=[
  body("price")
  .trim()
  .isNumeric().withMessage("Debe contener valores nunéricos")
  .isFloat({gt:0}).withMessage("El precio debe ser mayor a 0"),
  async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
     return res.status(400).json({errors:errors.array()})
    }
  try{
    const {id}=req.params;
    const product=await updateProduct(id,req.body)
    res.status(200).json(product);
  }catch(error){
    next(error)
  }
}]
//Filtrar productos por categoría
export const getCategoryController=async(req,res,next)=>{
  try{
    const {category}=req.params;
    const products=await getProductCategory(category);
    res.json(products)
  }catch(error){
    next(error)
  }
}
//Ordenar productos por precio
export const filterController=async(req,res,next)=>{
  try{
    const {category}=req.params;
    const {
      sortDirection,
      maxPrice,
      minPrice
    }=req.query;
    const filtros={
      category:category,
      sortDirection:sortDirection || "asc",
      maxPrice: parseFloat(maxPrice) || Infinity,
      minPrice: parseFloat(minPrice) || 1000
    }
    const productos=await filterProducts(filtros);
    res.json(productos)
  }catch(error){
    next(error);
  }
}
//Eliminar un producto
export const deleteDocument=async(req,res,next)=>{
  try{
    const {id}=req.params;
    const product=await deleteProduct(id);
    res.status(200).json(product)
  }catch(error){
    next(error)
  }
}
//Obtener los producto que comiencen con una letra determinada
export const getProductByTitle=async(req,res,next)=>{
  try{
    const {letter,sortDirection}=req.query;
    const search={
      letter:letter ? letter : null,
      sortDirection:sortDirection || "asc"
    }
    const product=await searchProducts(search)
    res.status(200).json({product,status:res.statusCode});
  }catch(error){
    next(error)
  }
}