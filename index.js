const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/01-db';
let mongo;

MongoClient
  .connect(mongoUrl, { useNewUrlParser: true })
  .then(function(client) {
    mongo = client.db();
    console.log('MongoDB started')
  });

// Index
app.get('/', function(_req, res) {
  res.redirect('/tasks');
});

// Index
app.get('/tasks', function(req, res) {
  mongo
    .collection('tasks').find().toArray()
    .then(function(tasks) {
      res.render('tasks/index', { tasks });
    });
});

// New
app.get('/tasks/new', function(req, res) {
  res.render('tasks/new');
});

// Show
app.get('/tasks/(:id)', function(req, res) {
  mongo
    .collection('tasks')
    .findOne({ _id: ObjectId(req.params.id) })
    .then(function(tasksItem) {
      res.render('tasks/show', { tasksItem });
    });
});

// Delete
app.get('/:id/delete', function(req, res) {
  mongo
    .collection('tasks')
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then(function() {
      res.redirect('/');
    });
});


// Create
app.post('/tasks', function(req, res) {
  mongo
    .collection('tasks')
    .insertOne(req.body)
    .then(function() {
      res.redirect('/tasks');
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`App started on http://localhost:${PORT}`);
});

app.listen();
