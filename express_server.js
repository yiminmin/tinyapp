const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');//add cookieParser
const bcrypt = require('bcrypt'); // Add this line to include bcrypt module


//create a user object
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10), // Passwords are hashed for added security
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10), // Passwords are hashed for added security
  },
};

app.set("view engine", "ejs");
app.use(cookieParser()); //apply cookieParser()

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// function generateRandomString() to generate an unique short url for the input long term url
function generateRandomString() {
    let result;
    do {
        result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    } while(urlDatabase[result]);
    return result;
}

app.use(express.urlencoded({ extended: true }));

// add the input url to urlDatabase;
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL; // Assume "longURL" is the name of input field
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL; // Add new generated shortURL-longURL pair to the database
  res.redirect("/urls/" + shortURL); // Redirect to page of newly created shortURL
});


// /urls/:id/delete update the delete button function
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;  // the the url id
  if (urlDatabase[id]) {
    delete urlDatabase[id];  // if the url exists, delete it
  }
  res.redirect("/urls"); // redirect to /urls
});

// app.post, update the edited context in /urls/:id
app.post("/urls/:id", (req, res) => {
    const id = req.params.id;
    if (urlDatabase[id]) {
        urlDatabase[id] = req.body.longURL; 
    }
    res.redirect("/urls");
});

// update Handle POST request to '/login' endpoint
app.post('/login', (req, res) => {
  // Extract the email from the request body
  const email = req.body.email;
  const password = req.body.password; // Extract password


  // You will need to implement some logic here to find the user by their email
  // and set the user_id cookie to the id of the user who's logging in
  // For example:
  for (let id in users) {
    if (users[id].email === email && bcrypt.compareSync(password, users[id].password)) { // Check if password matches
    res.cookie('user_id', id);
    return res.redirect('/urls');
    }
  }

  res.status(403).send('Email or password incorrect');

});

// add a new endpoint render the new login.ejs
// add a new endpoint render the new login.ejs
app.get("/login", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId]; // Lookup the specific user object using the user_id cookie value
  res.render("login", {user: user});
});



//add /logout route
app.post('/logout', (req, res) => {

  // Clear the 'username' cookie
  res.clearCookie('user_id');
  
  // Redirect the user to the '/urls' page
  res.redirect('/login');
});


app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  const userId = req.cookies["user_id"];
  const user = users[userId]; // Lookup the specific user object using the user_id cookie value


  if (longURL) {
    let templateVars = { shortURL: req.params.id, longURL: longURL, user: user };
    res.render("urls_show", templateVars);
  } else {
    res.status(404).send("Short URL Not Found");
  }
});

// Function to retrieve a user object based on their email address
function getUserByEmail(email, users) {
  for (let id in users) {
    if (users[id].email === email) {
      return users[id];
    }
  }
  return null;
}

// Handle POST request to '/register' endpoint
app.post('/register', (req, res) => {
  const email = req.body.email; // Extract the email from the request body
  const password = bcrypt.hashSync(req.body.password, 10); // Hash the password

   // Check if email or password are empty
  if (!email || !password) {
    return res.status(400).send('Email and password must not be empty');
  }

  // Check if email is already registered
  if (getUserByEmail(email, users)) {
    return res.status(400).send('Email is already registered');
  }
  
  // If email and password are valid, continue with registration
  // Generate a unique ID for the new user
  const userId = generateRandomString();

  // Create a new user object and add it to the 'users' object
  users[userId] = {
    id: userId,
    email: email,
    password: password
  };

  // Set a cookie named 'user_id' with the value of the newly generated user ID
  res.cookie('user_id', userId);

  // Redirect the user to the '/urls' page
  res.redirect('/urls');
});


//add get register route
app.get("/register", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId]; // Lookup the specific user object using the user_id cookie value
  res.render("registration", {user: user});
});

//update the /urls/new route
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId]; // Lookup the specific user object using the user_id cookie value

  const templateVars = { 
    urls: urlDatabase,
    user: user // Pass the entire user object
  };
  res.render("urls_index", templateVars);
});


// update the /urls/:id pass in the username
app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  const userId = req.cookies["user_id"];
  const user = users[userId]; // Lookup the specific user object using the user_id cookie value

  if (shortURL === 'new') { // 'new' page for creating a new URL
    return res.render("urls_new", { user: user });
  }
  if (longURL) {
    let templateVars = { 
      shortURL: shortURL, 
      longURL: longURL,
      user: user // Access the username from the cookie
    };
    return res.render("urls_show", templateVars);
  }

  return res.status(404).send("Short URL Not Found");
});



app.get("/set", (req, res) => {
 const a = 1;
 res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
 res.send(`a = ${a}`);
})

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});