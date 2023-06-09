import express from "express";
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import {fileURLToPath} from "url";
import router from './routes/expressRouter.js';
import UserRoutes from './routes/users.js';
import HomeRoutes from './routes/home.js'
import connectionDb from "./db.js";

dotenv.config();
// antes de iniciar la aplicacion o server se debe declarar que la conneccion a db debe suceder
connectionDb();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

//middlewares
app.use(router)
UserRoutes(app)
HomeRoutes(app)
app.use(morgan('dev'))

//Configurarions
app.set('case sensitive routing', true) // Inidca que las rutas deberan de calzar perfectamente, incluidas Mayusculas
app.set('appName', 'Express Course') // indica el nombre del proyecto
app.set('port', 3000) // indica el puerto
app.set('view engine', 'ejs') // indica el motor de vistas que usara el server
app.set('views', path.join(__dirname, 'views')) // indica donde accedera a las views 

app.get('/add/:x/:y', (req,res) => {
    const {x,y} = req.params;
    res.send(`Result ${parseInt(x) + parseInt(y)}`)
})

// al llamar una ruta en la variable de req se pueden alojar varios parametros uno de estos son los params los cuales vienen indicados en la ruta, y son requerido, otro parametro son las queries estas se alojan en la variable req.query en esta se almacenaran los datos que le pasemos en la ruta mediante una query
//para crear una quiery enm la ruta debemos indeicar los parametros despues de un "?" de lña sig manera
// localhost:3000/add/1/2?usuario=juan de esta manera tenemos 2 parametros dentro de la variable params y 1 paramentro dentro de la variable query
app.get('/search', (req,res) => {
    // las querys las podemos manejar ya sea para hacer una comparacion con algun string o una comparacion de base de datos
    if(req.query.q === 'javascript books'){
        res.send('Lista de Libros Javascript')
    }else{
        res.send('Pagina normal')
    }
})

// esta funcion contenida en el app.use, es una funcion que se ejecutara antes de cualquier ruta despues de esta, esto se le conose como middleware, esta funcion se púede utilizar para crear una logica antes de acceder a la logica de la ruta, por ejemplo se puede usar de logger, ya que aqui tambien se puede acceder al contenido que le estan pasando a la ruta

// las funciones middleware se pueden usar para cerar un methodo de authenticacion(proteger rutas con un login) en este de evaluaran las credenciales que tenga el usuario loggeado y determinara si lo deja pasar o no muestra la ruta 

// middleware Logger
// app.use((req, res, next) => {
//     console.log(`Route: ${req.url}, Method: ${req.method}`)  
//     next()
// })

// Se pueden crear diferentes middleware ya que cada uno es independiente
// middleware isAuthenticated
// app.use((req, res, next) => {
//     if(req.query.login === 'andres@gmail.com'){
//         next()
//     }else{
//         res.send('No Authenticated')
//     }
//  })

// tambien existen midleware de terceros(por la comunidad) morgan es un ejemplo este midleware muestra en consola la ruta a la que se accede asi como informacion adicional 
// el modleware tiene diferentes opciones los cuales repercutiran a la forma y cantidad de informacion que muestra ejemplo "dev, tiny, short, etc"

app.get('/profile', (req,res) => {
    res.send('Profile Page')
})

app.get('/dashboard', (req,res) => {
    res.render('dashboard')
})

app.get('/user', (req,res) => {
    res.send('user Page')
})

app.use('/public', express.static(path.join(__dirname, './public')))
app.use('/uploads', express.static(path.join(__dirname, './uploads')))

app.listen(app.get('port'))
console.log(`Proyecto ${app.get('appName')} iniciado en el puerto ${app.get('port')}`)