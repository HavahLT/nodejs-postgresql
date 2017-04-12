const express = require('express');
const app = express(); // application express
const users = require('./data/users.js');
const projects = require('./data/projects.js');
const pg = require('pg');
const urlBdd = process.env.DATABASE_URL || 'postgres://laur:mypass@localhost:5432/superbase';

//set the view engine
app.set('view engine', 'ejs');

// serve static files
app.use(express.static(__dirname + 'public'));

// user res.render to load up  and ejs file

// DATABASE

app.get('/database', function (req, res, next) {
   pg.connect(urlBdd, function (err, client, done) {
     if (err) {
       return next(err)
     }
     client.query('SELECT * FROM listUsers;', function (err, result) {
       done()

       if (err) {
         return next(err)
       }
       res.json(result.rows)
     })
   })
 })
  /*

  pg.connect(urlBdd, function (err, client, done) {
    if(err){
      return next(err)
    }

    client.query('SELECT * from animals', [], function (err, result){
      done()
      console.log(result.rows);
      res.json(result.rows)
    })
  })
});
*/

//INDEX PAGE
app.get('/', function(req, res) {
  res.render('pages/index');
})

// GET LIST USERS VIEW
.get('/users', function(req, res) {
	res.render('pages/users', {
		users: users.users
	});
})

// GET LIST projects
.get('/projects', function(req, res) {
	res.render('pages/projects', {
		projects: projects.projects
    // un commentaire
	});
})

// GET USERS ID VIEW
.get('/user/:id', function(req, res) {
	const user = users.find(item => {
		return Number(req.params.id) === item.id
	});
	if(user){
		 res.render('pages/user', {
			 user: user
		 });
	} else {
		res.send('Page non trouvée.');
	}
})

// GET PROJECTS ID VIEW
.get('/project/:id', function(req, res) {
	const project = projects.find(item => {
		return Number(req.params.id) === item.id
	});
	if(project){
		 res.render('pages/project', {
			 project: project
		 });
	} else {
		res.send('Page non trouvée.');
	}
})

// HANDLE ERROR 404
.get('/*', function(req, res) {
	res.render('pages/404');
});

// LISTEN TO SERVER
app.listen(5050, function() {
	console.log('App is listening on port 5050');
});
