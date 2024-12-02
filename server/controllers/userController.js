import { UserModel } from '../models/userModel.js';
import bcrypt from 'bcryptjs';

// Create a new user with hashed password
export const createUser = async (req, res) => {
  const { user_name, email, password, gender, role } = req.body;

  try {
    // Check if the user with the email already exists
    let user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user instance with hashed password
    user = new UserModel({
      user_name,
      email,
      password: hashedPassword,
      gender,
      role
    });

    // Save the user to the database
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: 'Failed to get users', error: error.message });
  }
};

// Get a user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Failed to get user', error: error.message });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update user', error: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete user', error: error.message });
  }
};
