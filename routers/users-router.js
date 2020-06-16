const router = require("express").Router();

const db = require('../data/db-connection.js')

router.get('/', (req, res)=>{
  db("users")
    .select("*")
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.log(err)
      res.status(500).json("An Error occurred when trying to fetch the Users List")
    })
})


module.exports = router