# Express-URL-Shortener

This repository contains a simple URL shortening application built using Node.js and Express. The application has the ability to create shortened URLs, manage (edit, delete) these URLs, and includes simple user authentication functionality (register, login, logout).

## Installation

Make sure you have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed on your machine.

1. Clone this repository:

   ```
   git clone https://github.com/yourusername/Express-URL-Shortener.git
   ```

2. Navigate into the directory of the project and install the dependencies:
   ```
   cd Express-URL-Shortener
   npm install
   ```

## Usage

To start the server, run:

```
node express_server.js
```

Then, navigate to `http://localhost:8080` in your browser.

## Features

- **URL Shortening**: Provide a long URL and the application will return a shortened URL. The mapping between the short URL and the long URL is kept in memory.

- **URL Management**: The application provides an interface to manage (edit, delete) the created shortened URLs.

- **User Authentication**: The application includes a simple user authentication feature. Users can register, login, and logout. User passwords are hashed before they are stored in memory for added security.

## Endpoints

- `POST /urls`: Add the input URL to the database.
- `POST /urls/:id/delete`: Delete a specific URL.
- `POST /urls/:id`: Update a specific URL.
- `POST /login`: Handle user login.
- `POST /logout`: Handle user logout.
- `POST /register`: Handle user registration.
- `GET /login`: Render the login page.
- `GET /register`: Render the registration page.
- `GET /urls`: Render the page listing all URLs.
- `GET /urls/:id`: Render a specific URL.
- `GET /u/:id`: Render a specific short URL.
- `GET /`: Application home.

## Dependencies

- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [EJS](https://ejs.co/) - Embedded JavaScript templating.
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme) - A library to help you hash passwords.
- [cookie-parser](https://www.npmjs.com/package/cookie-parser) - Cookie parsing middleware.

## Final Product

!["Screenshot of URLs page"](https://github.com/yiminmin/tinyapp/blob/main/docs/screenshot_of_urls.png)
!["Screenshot of register page"](https://github.com/yiminmin/tinyapp/blob/main/docs/register_page.png)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
