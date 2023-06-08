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
  "b6UTxQ": {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID",
  },
  "i3BoGr": {
    longURL: "https://www.google.ca",
    userID: "user2RandomID",
  },
};

// function urlsForUser(id) which return the URLs where the userID is equal to the id of the currently logged-in user
function urlsForUser(id) {
  const urls = {};
  for(let url in urlDatabase){
    if(urlDatabase[url].userID === id){
      urls[url] = urlDatabase[url];
    }
  }
  return urls;
}

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
  const userId = req.cookies["user_id"];
  if (!userId) { // if user is not logged in
    return res.status(401).send("Unauthorized: Please login first.");
  }
  const longURL = req.body.longURL; // Assume "longURL" is the name of input field
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: userId  // store user's ID with the URL
  };
  res.redirect("/urls/" + shortURL); // Redirect to page of newly created shortURL
});


// /urls/:id/delete update the delete button function
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;  // the the url id
  const userId = req.cookies["user_id"]; // get user ID from cookies

  if (urlDatabase[id] && urlDatabase[id].userID === userId) {
    delete urlDatabase[id];  // if the url exists and belongs to the current user, delete it
  } else {
    res.status(403).send("Forbidden: You don't have permission to delete this URL.");
  }
  res.redirect("/urls"); // redirect to /urls
});

// app.post, update the edited context in /urls/:id
app.post("/urls/:id", (req, res) => {
    const id = req.params.id;
    const userId = req.cookies["user_id"];
    if (urlDatabase[id] && urlDatabase[id].userID === userId) {
        urlDatabase[id].longURL = req.body.longURL; // only the longURL field needs to be updated
    } else {
        res.status(403).send("Forbidden: You don't have permission to edit this URL.");
    }
    res.redirect("/urls");
});

// update Handle POST request to '/login' endpoint
app.post('/login', (req, res) => {
  // Extract the email and password from the request body
  const { email, password } = req.body;

  for (let id in users) {
    if (users[id].email === email) { 
      if (bcrypt.compareSync(password, users[id].password)) { // Check if password matches
        res.cookie('user_id', id);
        return res.redirect('/urls');
      } else {
        return res.status(403).send('Password is incorrect');
      }
    }
  }

  // If the loop completes without finding a match, that means no user with that email was found
  return res.status(403).send('User with that email cannot be found');
});


// add a new endpoint render the new login.ejs
app.get("/login", (req, res) => {
  const userId = req.cookies["user_id"];
   if(userId){
    // User is logged in, redirect to /urls
    return res.redirect("/urls");
  }
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

  // New: send error message if the short URL doesn't exist
  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Short URL Not Found");
  }

  const longURL = urlDatabase[shortURL].longURL;
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

   // Check if email or password are empty
  if (!email || !password) {
    return res.status(400).send('Email and password must not be empty');
  }

  // Check if email is already registered
  if (getUserByEmail(email, users)) {
    return res.status(400).send('Email is already registered');
  }

  const password = bcrypt.hashSync(req.body.password, 10); // Hash the password

  

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
   if (userId) {  // The user is logged in
    return res.redirect("/urls");
  }
  const user = users[userId]; // Lookup the specific user object using the user_id cookie value
  res.render("registration", {user: user});
});

//update the /urls/new route
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId]; // Lookup the specific user object using the user_id cookie value
  if (!userId) { // if user is not logged in
    return res.status(401).send("Unauthorized: Please login first.");
  }
  const urls = urlsForUser(userId); // get URLs that belong to the logged-in user

  const templateVars = { 
    urls: urls,
    user: user // Pass the entire user object
  };
  res.render("urls_index", templateVars);
});

// get /urls/new
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  if (!userId) { // if user is not logged in
    return res.redirect("/login"); // redirect to login page if not logged in
  }
  const user = users[userId];
  const templateVars = { 
    user: user // Pass the entire user object
  };
  res.render("urls_new", templateVars);
});

// update the /urls/:id pass in the username
app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const userId = req.cookies["user_id"];
  const user = users[userId]; // Lookup the specific user object using the user_id cookie value

  if (!userId) { // if user is not logged in
    return res.status(401).send("Unauthorized: Please login first.");
  }
  if (urlDatabase[shortURL] && urlDatabase[shortURL].userID === userId) { // if URL exists and belongs to the logged-in user
    let templateVars = { 
      shortURL: shortURL, 
      longURL: urlDatabase[shortURL].longURL,
      user: user 
    };

    return res.render("urls_show", templateVars);
  }
  console.log("urlDatabase[shortURL]:", urlDatabase[shortURL]);
  console.log("userId:", userId);
  console.log("hello");


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