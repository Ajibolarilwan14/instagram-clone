const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
// const User = require('../models/user');
const User = mongoose.model("User");
const requireLogin = require('../middleWare/requireLogin');

// router.get('/protected', requireLogin, (req,res)=>{
//     res.send("Hello user, this is a protected route");
// });

router.post('/signup', (req,res)=>{
    // console.log(req.body);
    const {name, email, password,pic} = req.body;
    if (!email || !name || !password) {
        return res.status(422).json({error: "Please fill all fields"});
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if (savedUser) {
        return res.status(422).json({error: "user already exist with that email"});
        }
        bcrypt.hash(password, 12)
        .then(hashedPassword =>{
            const user = new User({
                email,
                password: hashedPassword,
                name,
                pic
            });
            user.save()
            .then(user=>{
                res.json({message: "signup successfully, please login"});
            })
            .catch(err=>{
                console.log(err);
                
            })
        })
        
    })
    .catch(err=>{
        console.log(err);
        
    })
    
});

router.post('/signin', (req,res) =>{
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(422).json({error: "Please provide a valid email and password"});
    }
    User.findOne({email:email})
    .then(savedUser =>{
        if (!savedUser) {
            return res.status(422).json({error: "Invalid email or password"});
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch =>{
            if(doMatch) {
                // res.json({message: "signed in successfully"});
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id, name, email, followers, following,pic} = savedUser
                res.json({token, user:{_id, name, email, followers, following,pic}})
            }
            else{
                return res.status(422).json({error: "Invalid email or password"});
            }
        })
        .catch(err => {
            console.log(err);
            
        })
    })
})

module.exports = router;