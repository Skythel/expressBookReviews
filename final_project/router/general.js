const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let authenticatedUser = require("./auth_users.js").authenticatedUser;
const jwt = require('jsonwebtoken');
const session = require('express-session')


public_users.post("/register", (req,res) => {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
        return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    res.send(JSON.stringify(books,null,4));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    const author = req.params.author;
    let result = {};
    for(item in books) {
        if(books[item].author == author) result[item] = books[item];
    }
    res.send(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    const title = req.params.title;
    let result = {};
    for(item in books) {
        if(books[item].title == title) result[item] = books[item];
    }
    res.send(result);
});

// Task 10 async
public_users.get('/async/', async function (req, res) {
    return new Promise((resolve,reject) => {
        resolve(books);
    }).then((result) => {
        res.send(result);
    })
});

// Task 11 async
public_users.get('/async/isbn/:isbn', async function (req, res) {
    return new Promise((resolve,reject) => {
        const isbn = req.params.isbn;
        resolve(books[isbn]);
    }).then((result) => {
        res.send(result);
    })
});

// Task 12 async
public_users.get('/async/author/:author', async function (req, res) {
    return new Promise((resolve,reject) => {
        const author = req.params.author;
        let result = {};
        for(item in books) {
            if(books[item].author == author) result[item] = books[item];
        }
        resolve(result);
    }).then((result) => {
        res.send(result);
    })
});

// Task 13 async
public_users.get('/async/title/:title', async function (req, res) {
    return new Promise((resolve,reject) => {
        const title = req.params.title;
        let result = {};
        for(item in books) {
            if(books[item].title == title) result[item] = books[item];
        }
        resolve(result);
    }).then((result) => {
        res.send(result);
    })
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

public_users.post('/login', (req, res) => {
	const username = req.body.username
	const password = req.body.password

	if (!username || !password) {
		return res.status(404).json({message: 'Error logging in'})
	}

	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign(
			{
				data: password,
			},
			'access',
			{expiresIn: 60 * 60}
		)

		req.session.authorization = {
			accessToken,
			username,
		}
		return res.status(200).send('User successfully logged in')
	} else {
		return res
			.status(208)
			.json({message: 'Invalid Login. Check username and password'})
	}
})

public_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
  //   return res.status(300).json({message: "Yet to be implemented"});
      const username = req.body.username;
      const review = req.body.review;
      const isbn = req.body.isbn;
      // object property will get updated if it already exists and created if does not exist
      books[isbn].reviews[username] = review;
      res.send(books[isbn].reviews);
});

public_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.body.username;
    const isbn = req.body.isbn;
    if (username){
        delete books[isbn].reviews[username]
    }
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
