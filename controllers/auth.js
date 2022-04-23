const req = require("express/lib/request");
const { redirect } = require("express/lib/response");
const User = require("../models/user");
const bcrypt = require('bcryptjs')

exports.getLogin =  (req, res, next) => {
    console.log(req.session)
    console.log(req.session.isLoggedIn)
    res.render('login',{
        pageTitle: 'Login Page',
        pathh: '/login',
        isAuthanticated : req.isLoggedIn
    })
};


exports.postLogin =  (req, res, next) => {
    


    const email = req.body.email
    const password = req.body.password

    User.findOne({email:email}).then(userDoc => {
        if(userDoc){
            console.log("user found in db ",userDoc)
            bcrypt.compare(password,userDoc.password).then(result=>{
              if(result){
                console.log('passport is correct')
                req.session.isLoggedIn = true
                req.session.user = userDoc
                return req.session.save(err=>{
                    console.log('aaaaaaaaaa',err)
                    res.redirect('/');
                })
              }else{
                console.log('passport is NOT correct' , hashPassword , userDoc.password)
                return res.redirect('/login')      
              }
            }).catch(err=>{
                console.log('passport is NOT correct 2');
                return res.redirect('/login')      
            })
        }else{
            return res.redirect('/signup')
        }
    }).catch(err=>{
        console.log(err)
    })
};

exports.postLogout =  (req, res, next) => {
    console.log("post logout is called")
    req.session.destroy((err)=>{
        res.redirect('/');
    })
};

exports.getSignup = (req, res, next) => {
    res.render('signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthanticated: false
    });
  };

exports.postSignup = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword

    

    User.findOne({email:email}).then(userDoc => {
        if(userDoc){
            return res.redirect('/signup')
        }

        bcrypt.hash(password,12).then(hashPassword=>{
            const user = new User(
                {
                    email : email,
                    password : hashPassword,
                    isAdmin : false
                }
            )
    
            user.save().then(result=>{
                return res.redirect('/login')
            })
        }).catch(err=>{
            console.log(err)
        })
    })
};