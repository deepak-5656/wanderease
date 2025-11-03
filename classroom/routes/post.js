const express = require("express");
const router = express.Router();

//posts
//users-
router.get("/posts",(req,res)=>{
    res.send("GET for posts");
});

//show 
router.get("/posts/:id",(req,res)=>{
    res.send("GET for show posts");
});

//POST
router.post("/posts",(req,res)=>{
    res.send("POST for posts");
});

router.delete("/posts/:id",(req,res)=>{
    res.send("DELETE for posts");
});

module.exports = router;