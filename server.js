// Servidor de la Aplicación.

var express 	= require('express');  //Express 4.16.2
var mongoose 	= require('mongoose'); //Mongoose 4.13.5
var logger  = require('express-logger'); // v0.0.3
var methodOverride = require('method-override') // v2.3.10

var app 		= express();

// CREAMOS LA Conexión MONGOOSE con la base de datos
mongoose.connect('mongodb://127.0.0.1:27017/angular-todo', { 
	useMongoClient: true,
	//keepAlive: true, 
	reconnectTries: 10
}); 
mongoose.Promise = global.Promise;

// COMPROBAMOS QUE LA CONEXiÓN CON MONGODB SE HA REALIZADO CON EXITO O NO.
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('conexion realizada con exito.');
});

// Modelo de la BBDD Mongoose
var TodoSchema = new mongoose.Schema({
  //text: {type: String, default: ''}
  text: {type: String, default: ''}
});

var Todo = mongoose.model('Todo', TodoSchema);

// Configuración de la Aplicación
// Localización de los ficheros estáticos
app.use(express.static(__dirname + '/public'));
// Para ver el log de los request.
app.use(logger({path: __dirname + "/logfile.txt"}));
// Hace las conversion JSON-String y String-JSON automaticamente.
app.use(express.json());
app.use(express.urlencoded({extended: true})); 
// for parsing application/x-www-form-urlencoded
// Simula DELETE y PUT						
app.use(methodOverride());

// Rutas de nuestro API *************************************************************************************************************************
// **********************************************************************************************************************************************
// GET de todos los TODOs
app.get('/api/todos', function(req, res) {	
	Todo.find({}, function(err, todos) {
		if(err) {
			res.send(err);
		}
		res.json(todos);
	});
});

// POST que crea un TODO y devuelve todos tras la creación
app.post('/api/todos', function(req, res) {	
	//console.log('servidor: text: ' + req.body.text);
	Todo.create({
		text: req.body.text,
		done: false
	}, function(err, todo){
		if(err) {
			res.send(err);
		}
		Todo.find(function(err, todos) {
			if(err){
				res.send(err);
			}
			res.json(todos);
		});
	});
});

// DELETE un TODO específico y devuelve todos tras borrarlo.
app.delete('/api/todos/:todo', function(req, res) {
	Todo.remove({
		_id: req.params.todo
	}, function(err, todo) {
		if(err){
			res.send(err);
		}

		Todo.find(function(err, todos) {
			if(err){
				res.send(err);
			}
			res.json(todos);
		});

	})
});

// Carga una vista HTML simple donde irá nuestra Single App Page
// Angular Manejará el Frontend
app.get('*', function(req, res) {						
	res.sendFile(__dirname + '/public/index.html');		
});

// Escucha en el puerto 1337 y corre el server
app.listen(1337, function() {
	console.log('App listening on port 1337');
});