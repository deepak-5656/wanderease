const express = require("express");
const router = express.Router();

//users-route
router.get("/users",(req,res)=>{
    res.send("GET for users");
});

//show users-route
router.get("/users/:id",(req,res)=>{
    res.send("GET for show users");
});

//POST-users
router.post("/users",(req,res)=>{
    res.send("POST for users");
});

router.delete("/users/:id",(req,res)=>{
    res.send("DELETE for users");
});

module.exports = router;