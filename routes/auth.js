const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
// const User = require('../models/user');
const User = mongoose.model("User");
const requireLogin = require('../middleWare/requireLogin');
const nodeMailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const {SENDGRID_API,EMAIL} = require('../config/keys');

// router.get('/protected', requireLogin, (req,res)=>{
//     res.send("Hello user, this is a protected route");
// });

const transporter = nodeMailer.createTransport(sendGridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))

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
                transporter.sendMail({
                    to: user.email,
                    from: "noreply.instameet@gmail.com",
                    subject: "sign up success",
                    html: "<h1>Welcome to instachat</h1><br><h4>You receive this email because you sign up on instameet</h4><br><p>chat and meet new people in 2020...happy chatting</p>"
                })
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
});

router.post('/reset-password', (req,res) => {
    crypto.randomBytes(32,(err, Buffer) => {
        if(err) {
            console.log(err);
            
        }
        const token = Buffer.toString("hex")
        console.log(Buffer);
        User.findOne({email: req.body.email})
        .then(user => {
            if(!user) {
                return res.status(422).json({error: "No user exist with that email!"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save()
            .then((result) => {
                transporter.sendMail({
                    to: user.email,
                    from: "noreply.instameet@gmail.com",
                    subject: "Request for Password Reset",
                    html: `
                    <p>hey there! someone requested to change your password on instameet</p>
                    <p>if you didn't initiate this request, ignore this but if you do click on the link below </p>
                    <h5>Click on this <a href="${EMAIL}/resetpassword/${token}">link</a> to reset your password</h5>
                    `
                })
                res.json({message: "The link to reset your password has been sent to your mail successfully..."})
            })
        })
        
    })
})

router.post('/new-password', (req,res) => {
    const newpassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken, expireToken:{$gt:Date.now()}})
    .then(user => {
        if(!user) {
            return res.status(422).json({error: "Try again, your session has expired!"})
        }
        bcrypt.hash(newpassword,12)
        .then(hashedPassword => {
            user.password = hashedPassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save()
            .then((savedUser) => {
                res.json({message: "Password updated successfully"})
            })
        })
    }).catch(err => {
        console.log(err);
        
    })
})

module.exports = router;