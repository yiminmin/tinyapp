const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");


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

// add new app.get,
// app.get("/urls/:shortURL", (req, res) => {
//   const shortURL = req.params.shortURL;
//   const longURL = urlDatabase[shortURL];
//   if (longURL) {
//     let templateVars = { shortURL: req.params.shortURL, longURL: longURL };
//     res.render("urls_show", templateVars);
//   } else {
//     res.status(404).send("Short URL Not Found");
//   }
// });

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


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id] };
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