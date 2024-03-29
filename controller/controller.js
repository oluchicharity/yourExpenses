const express = require("express");
const expenseModel = require("../models/models");
const { gentoken } = require('../jwt');
const jwt = require("jsonwebtoken");
require("../models/models");
const { validateCreateUser, validateLogin } = require('../validate/validator');
const cloudinary = require("../middleware/cloudinary");
const { dynamicEmail } = require("../html");
const bcrypt = require("bcrypt");
 const {Email} = require("../validate/email");

exports.createUser = async (req, res) => {
  try {
    const { error } = validateCreateUser(req.body);
            if (error) {
       return res.status(400).json(error.message);
           } else {
    const { Lastname, Firstname, email, password, phoneNumber} = req.body;

    // Check for required fields
    if (!Lastname || !Firstname || !email || !password ||!phoneNumber) {
      return res.status(400).json({
        message: "Missing required fields. Make sure to include Lastname, Firstname, email, and password.",
      });
    }

    // Check if the email already exists
    const emailExist = await expenseModel.findOne({ email: email.toLowerCase() });
    if (emailExist) {
      return res.status(400).json({
        message: "This email already exists",
      });
    }

    // Hash the password
const salt = await bcrypt.genSalt(12);
const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a JWT token
    const token = jwt.sign(
      { Lastname, Firstname, email },
      process.env.SECRET,
      { expiresIn: "120s" }
    );
    
    

    // Upload profile picture to Cloudinary
    // const profilepicture = req.files && req.files.profilepicture;
    // if (!profilepicture || !profilepicture.tempFilePath) {
    //   return res.status(400).json({
    //     message: "Profile picture is missing or invalid",
    //   });
    // }

    // let fileUploader;
    // try {
    //   fileUploader = await cloudinary.uploader.upload(profilepicture.tempFilePath);
    // } catch (error) {
    //   console.error("Error uploading profile picture to Cloudinary:", error);
    //   return res.status(500).json({
    //     message: "Error uploading profile picture to Cloudinary",
    //   });
    

    // Create a new user instance
    const newUser = new expenseModel({
      Lastname,
      Firstname,
      email: email.toLowerCase(),
      password: hashedPassword,
      phoneNumber,
      // profilepicture: {
      //   public_id: fileUploader.public_id,
      //   url: fileUploader.secure_url
      // }
    });
    // Construct a consistent full name
    const fullName = `${newUser.Firstname.charAt(0).toUpperCase()}${newUser.Firstname.slice(1).toLowerCase()} ${newUser.Lastname.charAt(0).toUpperCase()}`;
    // console.log(fullName);

    // Save the new user to the database
    const savedUser = await newUser.save();

    
    

    const generateOTP = () => {
      const min = 1000;
      const max = 9999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  const otp = generateOTP();
  
  const subject = "Kindly verify";

    savedUser.newCode = otp
    const html = dynamicEmail(fullName, otp)

   
    Email({
      email: savedUser.email,
      html:html,
      subject,
    })



    await savedUser.save();


    // Respond with success message and user data
    res.status(201).json({
      message: "Welcome, User created successfully",
      data: savedUser, token
    })}
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// Function to resend the OTP incase the user didn't get the OTP
exports. resendOTP = async (req, res) => {
  try {
      const id = req.params.id;
      const user = await expenseModel.findById(id);

      const generateOTP = () => {
        const min = 1000;
        const max = 9999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const subject = 'Email Verification'
    const otp = generateOTP();

      user.newCode = otp
      const html = dynamicEmail(fullName, otp)
      Email({
        email: user.email,
        html,
        subject
      })
      await user.save()
      return res.status(200).json({
        message: "Please check your email for the new OTP"
      })
      
    
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error: " + err.message,
    });
  }
};


//Function to verify a new user with an OTP
exports. verify = async (req, res) => {
  try {
    const id = req.params.id;
    //const token = req.params.token;
    const user = await expenseModel.findById(id);
    const { userInput } = req.body;
    // console.log(user);

    if (user && userInput === user.newCode) {
      // Update the user if verification is successful
      await expenseModel.findByIdAndUpdate(id, { isVerified: true }, { new: true });
    } else {
      return res.status(400).json({
        message: "Incorrect OTP, Please check your email for the code"
      })
    }
    if (user.isVerified === true) {
      return res.status(200).send("You have been successfully verified. Kindly visit the login page.");
    }

  } catch (err) {
      return res.status(500).json({
        message: "Internal server error: " + err.message,
      });
  }
};


exports. login = async (req, res) => {
  try {
    const { email, Firstname, password } = req.body;

    // Check if the user exists with the provided email or Firstname
    const user = await expenseModel.findOne({
      $or: [{ email}, { Firstname}],
    });
    // console.log(emailOrFirstname);

    if (user) {
      // If the user exists, compare the password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // If password is correct, generate and send a token
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.SECRET,
          { expiresIn: '120s' }
        );

        return res.json({
          message: 'Login successful',
          user: { email: user.email, Firstname: user.Firstname },
          token,
        });
      } else {
        return res.status(401).json({ error: 'Invalid password' });
      }
    } else {
      return res.status(401).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    return res.status(500).json(error.message);
  }
};



exports.getAll= async (req,res)=>{
  try {
     const users= await expenseModel.find(req.params) 
     if(!users){
      return res.status(404).json(`no users found`)
     }
    return res.status(200).json(users)
  } catch (error) {
      res.send(error.message)
  }
}

exports.getOne= async (req,res)=>{
  try {
     const user= await expenseModel.findById(req.params.id) 
     if(!user){
      return res.status(404).json(`this user has not been found`)
     }
    return res.status(200).json(user)
  } catch (error) {
      res.send(error.message)
  }
}

exports.updateUser= async (req,res)=>{
  try {
      const id= req.params.id

    const user = await expenseModel.findById(id)
    
    if(!user){
    return res.status(404).json({message:` user not found`})
   
  }else{
      const Data = {
        fullName: req.body.fullName || user.fullName,
        email:req.body.email || user.email,
        isAdmin:req.body.isAdmin || user.isAdmin,
        password:req.body.password || user.password
      };
      
      const update= await expenseModel.findByIdAndUpdate(id, Data, {new: true});
        res.status(200).json({message:`user${id} has been found and updated successfully`, data:update})
    
}
  } catch (error) {
      console.log(error.message)
  }
}


exports.category = async (req, res) => {
  try {
      const id = req.params.id;
      const { category, amount, description } = req.body;

      try {
          const user = await expenseModel.findById(id);

          if (!user) {
              return res.status(404).json(`User with this ID not found`);
          }

          const validCategories = ['Food', 'Utilities', 'Education', 'Other'];

          if (!validCategories.includes(category)) {
              return res.status(400).json(`Invalid category. Choose from: ${validCategories.join(', ')}`);
          }

          const newExpenses = {
              category,
              amount,
              description
          };

          // Push new expenses to user's expenses array
          user.expenses.push(newExpenses);

          // Save the updated user
          const updatedUser = await user.save();

          return res.status(201).json({ message: 'Category added successfully', data: newExpenses });
      } catch (error) {
          console.error('Error updating user with new expenses:', error.message);
          return res.status(500).json(error.message);
      }
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json(error.message);
  }
};
 

exports.totalExpense= async (req,res)=>{
  try {
    const userId = req.params.id;

    const user= await expenseModel.findById(userId)


    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalExpense = user.expenses.reduce((total, expense) => total + expense.amount, 0);

    return res.status(200).json({ userId: user.id, totalExpense });
  } catch (error) {
    console.error('Error calculating total expenses:', error);
    return res.status(500).json(error.message);
  }
};

// exports.deleteCategory = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     let categoryToDelete = req.params.category;

//     // Validate if categoryToDelete is present
//     if (!categoryToDelete) {
//       return res.status(400).json({ error: 'Category parameter is missing' });
//     }

//     // Assume you have a function to fetch users from your database
//     const users = await expenseModel.find();

//     // Find the user by their ID
//     const user = users.find((user) => user.id === userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Check if the user has an expenses array
//     if (!user.expenses || !Array.isArray(user.expenses)) {
//       return res.status(404).json({ error: 'Expense array not found' });
//     }

//     // Convert categoryToDelete to lowercase 
//     categoryToDelete = categoryToDelete.toLowerCase();

//     // Find the index of the category to delete
//     const categoryIndex = user.expenses.findIndex(
//       (expense) => expense.category.toLowerCase() === categoryToDelete
//     );

//     // Check if the category was not found
//     if (categoryIndex === -1) {
//       return res.status(404).json({ error: 'Category not found in expenses array' });
//     }

//     // Remove the category from the "expenses" array
//     user.expenses.splice(categoryIndex, 1);

//     // Save the updated user back to the database
//     await user.save();

//     return res.status(200).json({ userId: user.id, updatedExpenses: user.expenses });
//   } catch (error) {
//     console.error('Error deleting category:', error.message);
//     return res.status(500).json({ error: error.message });
//   }
// };




// Get expenses grouped by category for a user
exports.getCategory= async (req, res) => {
  
      try {
          const userId = req.params.userId;
      
          // Query the database to retrieve expenses for the specified user and category
          const userCategoryExpenses = await expenseModel.find({ userId });
         
          console.log(userCategoryExpenses);

          res.status(200).json(userCategoryExpenses);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }



exports.makeAdmin = async (req, res) => {
  try {
      const userId = req.params.id;

      // Find the user by ID
      const user = await expenseModel.findById(userId);

      if (!user) {
          return res.status(404).json(`User with ID ${userId} not found`);
      }

      // Update the user's role to 'admin'
      user.isAdmin = true;

      // Save the updated user
      const updatedUser = await user.save();

      return res.status(200).json({ message: 'User role updated to admin', data: updatedUser });
  } catch (error) {
      console.error('Error updating user role to admin:', error.message);
      res.status(500).json(error.message);
  }
};

        
        
exports.deleteUser = async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await expenseModel.findById(userID);

    if (!user) {
      return res.status(404).json({ message: `This user cannot be deleted` });
    }

    const deletedUser = await expenseModel.findByIdAndDelete(userID);

    return res.status(200).json({ message: `User has been deleted`});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

        