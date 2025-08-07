import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!phone || !email || !password || !name) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }
    const userEmail = await User.findOne({ email });
    const userPhone= await User.findOne({phone});
    if (userEmail) {
      return res.status(401).json({
        message: "Email already exist",
        success: false,
      });
    }
    else if (userPhone) {
      return res.status(401).json({
        message: "Phone already exist",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password:hashedPassword,
      phone,
    });
    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const token = await jwt.sign({ userId: user._id,name:user.name,email:user.email }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    user = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
      })
      .json({
        message: `Welcome back ${user.name}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};


export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateUser=async(req,res)=>{
    try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
      },
      { new: true }
    );
    res.status(200).json({ updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Profile update failed" });
  }
}

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    for (const msg of messages) {
      if (msg.fileUrl) {
        const match = msg.fileUrl.match(/\/chat_app\/chat_files\/([^\.]+)\./);
        let publicId;
        if (match) {
          publicId = `chat_app/chat_files/${match[1]}`;
        } else {
          const parts = msg.fileUrl.split('/upload/');
          if (parts[1]) {
            publicId = parts[1].split('.')[0];
          }
        }
        if (publicId) {
          try {
            await deleteFromCloudinary(publicId);
          } catch (e) {
            console.error('Failed to delete from Cloudinary:', publicId, e.message);
          }
        }
      }
    }

    await Message.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] });

    await Conversation.deleteMany({ participants: userId });

    await User.findByIdAndDelete(userId);

    res.status(200).json({ success: true, message: 'User and all associated data deleted.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
};

export const getAllUser=async(req,res)=>{
    try {
        const allUser = await User.find({ _id: { $ne: req.id } }).select("-password")

        if (!allUser) {
            return res.status(400).json({
                message: "Currently do not have any users",
            });
        }

        const logedUser = await User.findById(req.id).select("-password");
        return res.status(200).json({
            success: true,
            users: allUser,
            loggedUser: logedUser,
        });
      
    } catch (error) {
        console.log(error);
    }
}

export const getUser=async(req,res)=>{
    try {
        const id=req.params.id;

        const user=await User.findById(id).select("-password");

        if(!user) return res.status(400).json({message:"user not found",success:false});

        return res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        console.log("error in getting user",error);
    }
    
}