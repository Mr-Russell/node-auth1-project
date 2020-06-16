const router = require("express").Router();

const bcryptjs = require("bcryptjs");
const db = require('../data/db-connection.js');

router.post('/register', (req, res)=>{
  if (!req.body.username || !req.body.password) {
    res.status(401).json('Username AND Password are REQUIRED!')
  } else {
    const rounds = process.env.HASH_ROUNDS || 10
    const hash = bcryptjs.hashSync(req.body.password, rounds)
    db("users")
      .insert({username:req.body.username, password: hash})
      .then(user => res.status(200).json(`Thank you for Registering! Your ID number is ${user}`))
      .catch(err => {
        console.log(err)
        res.status(500).json(`An Error occurred while trying to register`)
      })
  }
})

router.post('/login', (req,res)=>{
  if (!req.body.username || !req.body.password) {
    res.status(401).json('Username AND Password are REQUIRED!')
  } else { 
    db("users")
      .select("*")
      .where({username: req.body.username})
      .then(user => {
        if (user.length === 0) {
          res.status(401).json({message: "You shall not pass!"})
        } else if (user.length > 0 && bcryptjs.compareSync(req.body.password, user[0].password)){
          req.session.user = {id: user.id, username: user.username};
          res.status(200).json(`Welcome back ${user[0].username}! You are now Logged In!`);
        }
      })
  }
})

router.get('/logout', (req,res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.log(err)
        res.status(500).json('An Error occurred when attempting to log you out')
      } else {
        console.log(req.session)
        res.status(201).json('You have been logged out').end()
      }
    })
  } else {
    console.log(req.session)
    res.status(201).json('You were never logged in').end()
  }
})



module.exports = router