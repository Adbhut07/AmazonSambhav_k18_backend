"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.updateUser = exports.deleteUser = exports.loginUser = exports.registerUser = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const user_model_1 = __importDefault(require("../models/user.model"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyName, businessType, email, personName, password, profilePicture } = req.body;
        const firebaseUser = yield firebase_admin_1.default.auth().createUser({
            email,
            password,
            displayName: personName,
        });
        const newUser = new user_model_1.default({
            companyName,
            businessType,
            email,
            personName,
            password: firebaseUser.uid,
            profilePicture,
        });
        yield newUser.save();
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if email and password are provided
        if (!email || !password) {
            res.status(400).json({ success: false, message: "Email and password are required." });
            return;
        }
        const firebaseUser = yield firebase_admin_1.default.auth().getUserByEmail(email);
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Login successful",
            user,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.loginUser = loginUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield user_model_1.default.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        yield firebase_admin_1.default.auth().deleteUser(user.password);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { companyName, businessType, email, personName, profilePicture } = req.body;
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(id, { companyName, businessType, email, personName, profilePicture }, { new: true });
        if (!updatedUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateUser = updateUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield user_model_1.default.findById(id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getUserById = getUserById;
