import express from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';

const userRoute = express.Router();

// userRoute.post('/', createUser);
userRoute.get('/', getUsers);
// userRoute.get('/:id', getUserById);
userRoute.put('/:id', updateUser);
// userRoute.delete('/:id', deleteUser);

export default userRoute;
