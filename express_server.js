const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');//add cookieParser


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

// Handle POST request to '/login' endpoint
app.post('/login', (req, res) => {
  // Extract the username from the request body
  const username = req.body.username;

  // Set a cookie named 'username' with the value of the extracted username
  res.cookie('username', username);

  // Redirect the user to the '/urls' page
  res.redirect('/urls');
});

//add /logout route
app.post('/logout', (req, res) => {
  // Clear the 'username' cookie
  res.clearCookie('username');
  
  // Redirect the user to the '/urls' page
  res.redirect('/urls');
});


app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  if (longURL) {
    let templateVars = { shortURL: req.params.id, longURL: longURL };
    res.render("urls_show", templateVars);
  } else {
    res.status(404).send("Short URL Not Found");
  }
});

//update the /urls/new route
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"] // Access the username from the cookie
  };
  res.render("urls_new", templateVars);
});


//update urls to pass in the username
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"] // Access the username from the cookie
  };
  res.render("urls_index", templateVars);
});

// update the /urls/:id pass in the username
app.get("/urls/:id", (req, res) => {
  let templateVars = { 
    shortURL: req.params.id, 
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"] // Access the username from the cookie
  };
  res.render("urls_show", templateVars);
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