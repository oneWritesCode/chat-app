import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    try {
        const { name, username, email, mobile, password } = req.body;
        if (!email || !password || !name || !username) {
            return res.status(400).json({ msg: "Missing required fields" });
        }

        if (await User.findOne({ email })) {
            return res.status(400).json({ msg: "Email already used" });
        }
        if (await User.findOne({ username })) {
            return res.status(400).json({ msg: "Username already taken" });
        }
        if (mobile && await User.findOne({ mobile })) {
            return res.status(400).json({ msg: "Mobile already used" });
        }

        const hashed = await bcrypt.hash(password, 12);
        const user = await User.create({ name, username, email, mobile, password: hashed });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        console.log("token generated ready to response");
        

        res.json({ 
            user: { 
                id: user._id, 
                name: user.name, 
                username: user.username,
                email: user.email 
            }, 
            token 
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier = email, username, or mobile
        const user = await User.findOne({ 
            $or: [
                { email: identifier }, 
                { username: identifier },
                { mobile: identifier }
            ] 
        });
        
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });
        if (!user.password) return res.status(400).json({ msg: "Use OAuth login" });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

        // Update online status
        await User.findByIdAndUpdate(user._id, { 
            isOnline: true, 
            lastSeen: new Date() 
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ 
            user: { 
                id: user._id, 
                name: user.name, 
                username: user.username,
                email: user.email 
            }, 
            token 
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { 
            isOnline: false, 
            lastSeen: new Date() 
        });
        res.json({ msg: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, username, email, mobile } = req.body;
        const userId = req.user._id;
        
        // Check if username is already taken by another user
        if (username) {
            const existingUser = await User.findOne({ 
                username, 
                _id: { $ne: userId } 
            });
            if (existingUser) {
                return res.status(400).json({ msg: "Username already taken" });
            }
        }
        
        // Check if email is already used by another user
        if (email) {
            const existingUser = await User.findOne({ 
                email, 
                _id: { $ne: userId } 
            });
            if (existingUser) {
                return res.status(400).json({ msg: "Email already used" });
            }
        }
        
        // Check if mobile is already used by another user
        if (mobile) {
            const existingUser = await User.findOne({ 
                mobile, 
                _id: { $ne: userId } 
            });
            if (existingUser) {
                return res.status(400).json({ msg: "Mobile already used" });
            }
        }
        
        const updateData = {};
        if (name) updateData.name = name;
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (mobile) updateData.mobile = mobile;
        
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true }
        );
        
        res.json({ 
            user: { 
                id: updatedUser._id, 
                name: updatedUser.name, 
                username: updatedUser.username,
                email: updatedUser.email,
                mobile: updatedUser.mobile
            },
            msg: "Profile updated successfully" 
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Delete user account
        await User.findByIdAndDelete(userId);
        
        res.json({ msg: "Account deleted successfully" });
    } catch (error) {
        console.error("Delete account error:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};
