const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const toyService = require("./services/toy-service");
const app = express();
const expressSession = require('express-session');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/api/toy', (req, res) => {
  console.log('Backend getting Toys');
  const filterBy = {
    name: req.query.name || '',
    labels: req.query.labels || [],
    inStock: req.query.inStock || '',
    sortBy: req.query.sortBy || '',
  };
  toyService.query(filterBy).then((toys) => {
    res.send(toys);
  });
});


app.get('/api/toy/:toyId', (req, res) => {
  console.log('Backend getting your Toy:', req.params.toyId);
  toyService
    .getById(req.params.toyId)
    .then((toy) => {
      res.send(toy);
    })
    .catch((err) => {
      console.log('Backend had error: ', err);
      res.status(404).send('No such toy');
    });
});

app.delete('/api/toy/:toyId', (req, res) => {
  console.log('Backend removing Toy..', req.params.toyId);
  toyService
    .remove(req.params.toyId)
    .then(() => {
      res.send({msg: 'Removed'});
    })
    .catch((err) => {
      console.log('Backend had error: ', err);
      res.status(404).send('Cannot remove Toy');
    });
});


app.post('/api/toy', (req, res) => {
  console.log('Backend Saving Toy:', req.query.name);
  const {name, price, inStock, labels, reviews} = req.body;
  const toy = {
    name,
    price,
    inStock,
    labels,
    reviews,
    createdAt,
  };

  toyService
    .save(toy)
    .then((savedToy) => {
      res.send(savedToy);
    })
    .catch((err) => {
      console.log('Backend had error: ', err);
      res.status(404).send('Cannot create toy');
    });
});


app.put('/api/toy/:toyId', (req, res) => {
  console.log('Backend Saving Toy:', req.body.name);
  const {_id, name, price, createdAt, inStock, labels, reviews} = req.body;
  const toy = {
    _id,
    name,
    price,
    createdAt,
    inStock,
    labels,
    reviews,
  };

  toyService
    .save(toy)
    .then((savedToy) => {
      res.send(savedToy);
    })
    .catch((err) => {
      console.log('Backend had error: ', err);
      res.status(401).send('Cannot update Toy');
    });
});

app.listen(3030, () => console.log('Server listening on port 3030'))