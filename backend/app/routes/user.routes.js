import express from "express"
import { getAllUser, getUser, login, logout, register, updateUser, deleteUser } from "../controller/user.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";



const userRouter=express.Router();

userRouter.route('/signup').post(register);
userRouter.route('/login').post(login);
userRouter.route('/logout').post(logout);
userRouter.route('/getalluser').get(isAuthenticated, getAllUser);
userRouter.route('/getuser/:id').get(isAuthenticated,getUser);
userRouter.route('/updateprofile/:id').put(isAuthenticated,updateUser);
userRouter.route('/deleteuser/:id').delete(isAuthenticated, deleteUser);

export default userRouter;