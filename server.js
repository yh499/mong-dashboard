
var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/zoo');
mongoose.Promise = global.Promise;

var AnimalSchema = new mongoose.Schema({
    name: String,
    home: String 
})
mongoose.model('Animals',AnimalSchema);
var Animals = mongoose.model('Animals')

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var path = require('path');

app.use(express.static(path.join(__dirname, '/static')));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Root Request===============================================
app.get('/', function (req, res){
    Animals.find({}, function(err,result){
        res.render('index', {panda: result});
        console.log(result);
    });
})

app.post('/panda', function(req, res) {
  console.log("POST DATA", req.body);
  // create a new User with the name and age corresponding to those from req.body
  var animal = new Animals({name: req.body.name, home: req.body.home });
  // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  animal.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong');
      res.render('index', {errors: animal.errors})
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a animal!');
      res.redirect('/');
    }
  })
})

app.get('/panda/new', function(req,res){
    res.render('new');
})


app.get('/panda', function (req, res){
    Animals.find({}, function(err,result){
        res.render('index', {panda: result});
        console.log(result);
    });
})

//showpage============================
app.get('/panda/:id', function (req, res){
    Animals.find({_id:req.params.id}, function(error, panda) {
        console.log(panda);
        res.render('show', {panda:panda})
    })    
})


//show EDIT page =======================
app.get('/panda/edit/:id', function (req, res){
    Animals.find({_id:req.params.id}, function(error, panda) {
        console.log(panda);
        res.render('edit', {panda:panda})
    })    
})


app.post('/panda/edit/:id', function(req, res) {
  console.log("POST DATA", req.body);
 
    Animals.update({_id: req.params.id }, req.body, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("UPDATE");
            res.redirect('/')
        }
    // This code will run when the DB has attempted to update the matching record.
    })
});

app.get('/delete/:id', function(req, res){
    Animals.remove({_id: req.params.id }, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("remoeeev");
            res.redirect('/')
        }
    // This code will run when the DB has attempted to update the matching record.
    })
}
)
    
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})


