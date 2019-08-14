const csv = require('csv-parser');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");   

const results = [];

app.get('/', (req,res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  if(req.body.bookType == 'default') {
    res.redirect('/');
  }
  else {
    fs.createReadStream('Task1/test.csv')
    .pipe(csv(['amazonIndex', 'filename', 'imageURL', 'title', 'author', 'categoryID', 'category']))
    // parses CSV, finds all the books with the requested category
    .on('data', (data) => {
      if(data.categoryID == req.body.bookType) {
        results.push(data);
      }
    })
    .on('end', () => {
      // send random book from that category
      let randomNum = Math.floor((Math.random() * results.length) + 1)
      let rb = results[randomNum];
      res.render('book', {title: rb.title, author: rb.author, image: rb.imageURL});
    });
  
   
  }
});

app.listen('3000', () => {
  console.log('listening on port 3000!');
});







