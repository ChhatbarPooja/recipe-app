import bcrypt from "bcryptjs";
import { UserModel } from "../models/userModel.js";
import generateToken from "../utils/jwtToken.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const randomBytesAsync = promisify(crypto.randomBytes);

export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const token = (await randomBytesAsync(20)).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: 'xarg vrod ltdt vjmj'
      },
    });
    console.log(transporter)
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             ${resetLink}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error('There was an error: ', err);
        return res.status(500).json({ message: 'Error sending email' });
      }

      res.status(200).json({ message: 'Recovery email sent' });
    });
  } catch (error) {
    console.error('Internal server error: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const resetPasswordController = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find user with the reset token and check if token is expired
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set the new password and clear the reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const registerController = async (req, res) => {

  const { user_name, email, password, role } = req.body;

  try {
    let user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new UserModel({
      user_name,
      email,
      password: hashedPassword,
      role,
      status: 'pending'
    })


    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

export const getUserProfileController = async (req, res) => {
  const { id } = req.params;

  try {
    const pageIndex = parseInt(req.query.pageIndex) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search ? req.query.search.trim() : '';
    const status = req.query.status ? req.query.status : '';

    let matchStage = {
      $and: []
    };

    // Add status filtering
    if (status === 'pending' || status === 'approved' || status === 'rejected') {
      matchStage.$and.push({ status });
    } else {
      matchStage.$and.push({ status: { $in: ['pending', 'approved', 'rejected'] } });
    }

    // Add search filtering if provided
    if (search) {
      matchStage.$and.push({
        $or: [
          { user_name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { role: { $regex: search, $options: 'i' } }
        ]
      });
    }

    const skip = (pageIndex - 1) * pageSize;

    let users;
    if (id) {
      users = await UserModel.findById(id);
      if (!users) {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      // Fetch users list based on filters and pagination
      users = await UserModel.find(matchStage.$and.length ? { $and: matchStage.$and } : {})
        .skip(skip)
        .limit(pageSize);

      const totalUsers = await UserModel.countDocuments(matchStage.$and.length ? { $and: matchStage.$and } : {});

      return res.status(200).json({
        users,
        pageIndex,
        pageSize,
        totalUsers,
        totalPages: Math.ceil(totalUsers / pageSize),
      });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (user.status == 'pending') {
      return res.status(403).json({ message: 'Admin has not accepted your request please wait until andmin accept' });
    }
    else if (user.status == 'rejected') {
      return res.status(403).json({ message: 'Admin has rejected your request please contact admin' });
    }


    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const payload = {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };

    const token = await generateToken(payload);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        role: user.role,
        user_name: user.user_name
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};


export const changePasswordController = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user._id;

  try {
    const user = await UserModel.findById(userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserController = async (req, res) => {
  const { id } = req.params;
  const { user_name, email, gender, role, dob, country, city, state, pincode, change_image } = req.body;

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details if provided, otherwise keep the existing values
    user.user_name = user_name ?? user.user_name;
    user.email = email ?? user.email;
    user.gender = gender ?? user.gender;
    user.role = role ?? user.role;
    user.dob = dob ?? user.dob;
    user.country = country ?? user.country;
    user.city = city ?? user.city;
    user.state = state ?? user.state;
    user.pincode = pincode ?? user.pincode;
    user.change_image = change_image ?? user.change_image;

    // If a file was uploaded, update the profileImage field with the file path
    if (user.change_image == "true") {
      user.images = '';
    }
    if (req.file) {
      user.images = req.file.path; // Save the file path in the database
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

export const updateUserStatusController = async (req, res) => {
  const { userId, status } = req.body;
  console.log(req)
  console.log(userId)
  try {
    let user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;

    await user.save();

    res.status(200).json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

export const userStatusUpdate = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body
  try {

    const approvedUser = await UserModel.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    console.log("Updating user ID:", id, "with status:", status);
    res.status(200).json(approvedUser)
  } catch (error) {

  }
}
