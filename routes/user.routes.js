import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";

import authorize from "../middlewares/auth.middleware.js"; //all for showing the correct user not to all

const userRouter = Router();

userRouter.get('/', getUsers); //remeber for now this exposes all users to all users ....need to prevent that from happening// thats why AUTH.MIDDLEWARES.js

userRouter.get('/:id', authorize, getUser); //auth.middleware.js //middle so middleware

userRouter.post('/', (req, res) => res.send({ title: 'CREATE new user' }));

userRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE user' }));

userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE all users' }));

export default userRouter;

//For Logic goes to controllers user