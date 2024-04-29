const express = require("express");
const router = express.Router();
const z = require("zod");
const { User } = require("../db/index");
const jwt = require("jsonwebtoken");
const  JWT_SECRET  = require("../config");

const signupBody = z.object({
    username: z.string().email(),
    firstname: z.string(),
    lastname: z.string(),
    password: z.string()
});
const signinBody = z.object({
    username: z.string().email(),
	password: z.string()
})
router.post("/signup", async (req, res) => {
    const success = signupBody.safeParse(req.body);
   
    console.log(success);
    if (!success) {
        return res.status(400).json({
            msg: "Invalid Input"
        });
    }
 
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists) {
        return res.status(409).json({
            msg: "Username Already exists!"
        });
    }

    try {
        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
     

        const token = jwt.sign({ UserId: user._id }, "JWT_SECRET");
        return res.status(200).json({
            msg: "User seucessfully Created !",
            token: token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            msg: "Internal Server Error",error:err.message
        });
    }
});
router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

  


module.exports = router;