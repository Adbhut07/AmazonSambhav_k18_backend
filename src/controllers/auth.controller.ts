import express, { Request, Response } from "express";
import admin from "firebase-admin";
import User, { IUser } from "../models/user.model";


export const registerUser: express.RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyName, businessType, email, personName, password, profilePicture } = req.body;

    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: personName,
    });

    const newUser: IUser = new User({
      companyName,
      businessType,
      email,
      personName,
      password: firebaseUser.uid, 
      profilePicture,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const loginUser: express.RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required." });
      return;
    }

    const firebaseUser = await admin.auth().getUserByEmail(email);

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteUser: express.RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    await admin.auth().deleteUser(user.password); 

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateUser: express.RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { companyName, businessType, email, personName, profilePicture } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { companyName, businessType, email, personName, profilePicture },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserById: express.RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};