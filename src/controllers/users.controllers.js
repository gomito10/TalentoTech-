import {registerUser,loginUser,getUsers,getUser,updateUser,deleteUser} from "../models/users.model.js";
import {body,validationResult} from "express-validator";

//Registrar usuario
export const register=[
  body("username")
  .trim()
  .notEmpty().withMessage("Completar este campo")
  .isLength({min:8,max:20}).withMessage("El usuario debe contener entre 8 y 20 caracteres"),
  body("password")
  .trim()
  .notEmpty().withMessage("Completar este campo")
  .isLength({min:8,max:20}).withMessage("El password debe contener entre 8 y 20 caracteres"),
  body("email")
  .trim()
  .notEmpty().withMessage("Completar este campo")
  .isEmail().withMessage("Formato incorrecto"),
  body("role")
  .trim()
  .notEmpty().withMessage("Completar este campo")
  .matches(/^(admin|user)$/).withMessage("El rol debe ser admin o user"),
  body("confirmPassword")
  .trim()
  .custom((value,{req})=>{
    if(value!==req.body.password){
      throw new Error("Las contraseñas no coinciden")
    }
    return true
  }),
  async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      res.status(400).json({errors:errors.array()})
    }
  try{
    const{
      username,password,confirmPassword,email,role}=req.body;
    const user=await registerUser({username,password,email,role});
    res.status(201).json(user)
  }catch(error){
    next(error)
  }
}]
//Loguin de usuario
export const login=async(req,res,next)=>{
  try{
    const{username,password}=req.body;
    const result=await loginUser(username,password)
    res.status(200).json(result)
  }catch(error){
    next(error)
  }
}
//Obtener todos los usuarios
export const getUsersController=async(req,res,next)=>{
  try{
    if(req.user.role === "admin"){
      const users=await getUsers();
      res.status(200).json(users
      );
    }else{
      throw new Error("El usuario no es un administrador")
    }
  }catch(error){
    next(error)
  }
}
//Obtener un usuario determinado
export const getUserController=async (req,res,next)=>{
  try{
    const {id}=req.params;
    if(req.user.role === "admin"){
      const user=await getUser(id)
      res.status(200).json(user);
    }else{
      throw new Error("El usuario no es un administrador")
    }
  }catch(error){
    next(error)
  }
}
//Actualizar usuario
export const update=[
  body("username")
  .optional()
  .trim()
  .isLength({min:8,max:20}).withMessage("El usuario debe contener entre 8 y 20 caracteres"),
  body("email")
  .optional()
  .trim()
  .isEmail().withMessage("Formato incorrecto"),
  body("passworord")
  .optional()
  .trim()
  .isLength({min:8,max:20}).withMessage("Debe contener entre 8 y 20 caractéres"),
  async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      res.status(400).json({errors:errors.array()})
    }
  try{
    const {id}=req.params
    const cambios=req.body
    if(req.user.role === "admin"){
    const update=await updateUser(id,cambios)
    res.json(update)
    }else{
      throw new Ertor("El usuario no es un administrador")
    }
  }catch(error){
    next(error)
  }
}]
//Eliminar usuario
export const removeUser=async(req,res,next)=>{
  try{
    const {id}=req.params;
    if(req.user.role === "admin"){
    const user=await deleteUser(id);
    res.json(user);
    }else{
     return res.status(403).json({error:"El usuario no es un administrador"});
    }
  }catch(error){
    next(error)
  }
}