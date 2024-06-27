const express = require('express');
const z = require('zod');
const jwt = require('jsonwebtoken');
const {User} = require('../Db/index'); 
const middleware = require('../../middleware/middleware');

require('dotenv').config();

const router = express.Router();


const signUpSchema = z.object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    username: z.string().min(1, "Username is required").email(),
  });
  
  // Define signin schema for validation
  const signinSchema = z.object({
    username: z.string().email(),
    password: z.string(),
  });
  
  // Signup route
  router.post('/signup', async (req, res) => {
    try {
      // Validate incoming request body
      const { success, data } = signUpSchema.safeParse(req.body);
      if (!success) {
        return res.status(400).json({
          msg: "Invalid Input",
        });
      }
  
      // Check if the username already exists
      const existingUser = await User.findOne({ username: data.username });
      if (existingUser) {
        return res.status(409).json({ msg: "Username already exists" });
      }
  
      // Create a new user document
      const newUser = await User.create(data);
  
      // Generate JWT token
      const token = jwt.sign({ user_id: newUser._id }, process.env.jwt_secret);
  
      res.json({
        msg: "User Created Successfully",
        token: token,
      });
    } catch (error) {
      console.error("Error creating user:", error.message);
      res.status(500).json({ msg: "Server Error" });
    }
  });
  
  // Signin route
  router.post('/signin', async (req, res) => {
    try {
      // Validate incoming request body
      const { success, data } = signinSchema.safeParse(req.body);
      if (!success) {
        return res.status(400).json({
          msg: "Invalid Input",
          errors: signinSchema.error.errors,
        });
      }
  
      // Find user by username
      const user = await User.findOne({ username: data.username });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      // Compare passwords (for demo purposes, you might want to use bcrypt in production)
      if (user.password !== data.password) {
        return res.status(401).json({ msg: "Invalid credentials" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ user_id: user._id }, process.env.jwt_secret);
  
      res.json({ msg: "Signin successful", token: token });
    } catch (error) {
      console.error("Error signing in:", error.message);
      res.status(500).json({ msg: "Server Error" });
    }
  });
  

  const putSchema = z.Schema({
    firstname:z.string().optional().min(1),
    lastname:z.string().optional().min(1),
    password:z.string().optional().min(6)

  })

  //update name, password

  router.put('/',middleware,async (req,res)=>{
    const {success, data}= putSchema.safeParse(req.body);
    if (!success){
        return res.status(403).json({msg:"Invalid Inputs"})
    }
    
    const userid = req.userId

    await User.updateOne({_id:userid},data);
    res.status.json({msg:"Updated Successfully"})
  })
  module.exports = router;