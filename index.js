const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require('bcrypt');
// const { DataTypes } = require('sequelize/types');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post("/register", async(req, res, next) => {
  try {
  //alternative - const{username, password} = req.body; 
  const username = req.body.username; 
  const password = req.body.password; 

  const SALT_COUNT = 10; 
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT); 

  const newUser = await User.create({username, password: hashedPassword})

  if (newUser !== "") {
    res.send(`successfully created user ${username}`);
  } else {
    return "Failed to create user"; 
  }
    
  } catch (error) {
    console.log(error);
    next(error);
  }
  

})

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB

app.post("/login", async(req, res, next) => {
  try {
    //alternative - const{username, password} = req.body; 
    const username = req.body.username; 
    const password = req.body.password; 

    const hashedPassword = await bcrypt.hash(password, 10); 

    const foundUser = await User.findOne({where: {username: username}}); 

  
    if (foundUser === null) {
      res.status(401).send(`incorrect username or password`);
    } else {
      const passwordsMatch = await bcrypt.compare(password, foundUser.password); 
      if(passwordsMatch) {
        res.send(`successfully logged in user ${username}`);
    } else {
      res.status(401).send(`incorrect username or password`);
    }
  }
  } catch (error) {
    console.log(error);
    //passing the error along so we can deal with it in an error handling method elsewhere 
    next(error);
  }
})

//EXTENSION - Hash the passwords for all users when creating them (SEEDED USERS)
//Using something like Array.prototype.map() would be great here, calling bcrypt.hash for each password.
//Try using Promise.all() to let each promise resolve in concurrency (more efficient).

async function hashingUserDetails (req,res)  {
  const allUsers = await User.findAll()
  // console.log(allUsers)
  const hashedPasswords = await Promise.all(allUsers.map(async (user) => {
    return await bcrypt.hash(user.password, 10);
  }));
  console.log(hashedPasswords)
 }


hashingUserDetails();


//EXTENSION - Add a model like Post or Recipe or anything that can be associated to a User.
//Create seed data for 2-3 of the users in the seed file.


//EXTENSION - In other lessons, we’ll learn about better authentication & authorization flows, but for now:
//Similar to how POST /login works, use the username and password to authenticate the user.
//If the password matches, send back the associated data created in the last bonus step.



// we export the app, not listening in here, so that we can run tests
module.exports = app;
