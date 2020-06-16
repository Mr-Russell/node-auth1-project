const express = require("express");

const session = require('express-session');
const KnexSessions = require('connect-session-knex')(session)
const dbConnection = require('./data/db-connection.js')


const server = express();

const sessionConfig = {
  name: 'chocolateChip',
  secret: process.env.SESSION_SECRET || 'klatu barata nikto',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: process.env.COOKIE_SECURE || false,
    httpOnly: true,
  },
  resave: false, 
  saveUninitialized: true,
  store: new KnexSessions({
    knex: dbConnection,
    tablename: 'sessions',
    // sidfieldname: 'lebowski',
    createtable: true,
    // clearInterval: 1000 * 60 * 60
  })
}

server.use(express.json());
server.use(session(sessionConfig))

const requiresAuth = require('./routers/requires-auth.js')
const usersRouter = require('./routers/users-router.js')
server.use('/api/users', requiresAuth, usersRouter)

const authRouter = require("./routers/auth-router.js")
server.use('/api/auth', authRouter)

const port = process.env.PORT || 9001;

server.listen(port, ()=> console.log(`\n === Server Running on Port ${port} ===`))