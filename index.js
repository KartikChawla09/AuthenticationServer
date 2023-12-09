const express = require("express");
const bodyParser = require("body-parser");
const PORT = 3000;
const app = express();

app.use(bodyParser.json());

var users = [];

function newUserLogin(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  let userExists = false;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == username) {
      userExists = !userExists;
      break;
    }
  }
  if (userExists) {
    res.status(400).send("Username Already Exists");
  } else {
    var newUser = {
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
    };
    users.push(newUser);
    res.status(201).send("New User Created Successfully");
  }
}

function oldUserLogin(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == username) {
      if (users[i].password == password) {
        var userDetails = {
          firstName: users[i].firstName,
          lastName: users[i].lastName,
        };
        res.status(200).send(userDetails);
      } else {
        res.status(401).send("Credentials Invalid");
      }
    }
  }
  res.status(401).send("Unauthorized");
}

function dataHandler(req, res) {
  var email = req.headers.email;
  var password = req.headers.password;
  let userFound = false;
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      userFound = true;
      break;
    }
  }

  if (userFound) {
    let usersToReturn = [];
    for (let i = 0; i < users.length; i++) {
      usersToReturn.push({
        firstName: users[i].firstName,
        lastName: users[i].lastName,
        email: users[i].email,
      });
    }
    res.json({
      users,
    });
  } else {
    res.sendStatus(401);
  }
}

app.post("/signup", newUserLogin);
app.post("/login", oldUserLogin);
app.get("/data", dataHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
