const express = require('express');
const app = express();
const uuid = require('uuid/v4');

app.use(express.static(__dirname + '/public'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3003;
app.listen(port , () => console.log('App listening on port ' + port));


/*  PASSPORT SETUP  */

const passport = require('passport');
const session = require('express-session');
app.use(session({secret: 'keyboardcat'}));
app.use(passport.initialize());
app.use(passport.session());


/* MONGOOSE SETUP */

const mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin123@ds145093.mlab.com:45093/todo-list', (error) => {
        if(error) {
            console.log("There was an error connecting to MongoDB.");
            console.log(error);
        } else {
            console.log("Successfully connected to MongoDB!");
        }
});



const UserDetail = new mongoose.Schema({
    username: String,
    password: String,
    categories: Array
});
const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    UserDetails.findOne({id: id}, function(err, user) {
        cb(err, user);
    });
});

/* PASSPORT LOCAL AUTHENTICATION */

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    function(username, password, done) {
        UserDetails.findOne({
            username: username

        }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (user.password != password) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

/* APP ROUTES */

app.get('/', (req, res) => res.sendFile('auth.html', { root : __dirname + '/public'}));

app.get('/success', (req, res) => res.sendFile('tasks.html', { root: __dirname + '/public'}));
app.get('/error', (req, res) => res.send("error logging in"));

passport.CreateSession = function(req, res, next) {
    passport.authenticate('local', function (err, user) {
        req.logIn(user, function (err) { // <-- Log user in
            if (err) {
                return res.redirect('/error');
            }
            return  res.redirect('/success?username='+req.user.username);
        });
    })(req, res);
};
app.post('/', passport.CreateSession);

app.post('/edit', (req, res) => {
    UserDetails.findByIdAndUpdate(req.body.user._id, req.body.user, {new: true}, (err, updatedUser) => {
        if (err) console.log(err);
        res.send(updatedUser);
    });
});

app.post('/user', (req, res) => {
    UserDetails.findOne({username: req.body.username}, (err, user) => {
        if (!err) {
            res.send(user);
        }
    });
});