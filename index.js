const express = require("express")
const app =express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Todo = require("./models/todo")

require('dotenv').config();
//conect to database MongoAtlas in the Cloud

const user = process.env.user;
const password = process.env.password;
const dbname = process.env.dbname;
const uri = `mongodb+srv://${user}:${password}@cluster0.unwmdql.mongodb.net/${dbname}?retryWrites=true&w=majority`

mongoose.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true}
)

    .then(() => console.log('Base de datos conectada'))
    .catch(e => console.log(e))

const port =3005

//...

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


app.get("/", (request, response) => {
    Todo.find()
    .then(result => {
        response.render("index", {data: result})
        console.log(result)
    })
})

app.post("/", (request, response) => {
    const todo = new Todo({
       todo: request.body.todoValue  
    })
    todo.save()
    .then(result => {
        response.redirect("/")
    })
})

app.delete("/:id", (request, response) => {
    Todo.findByIdAndDelete(request.params.id)
    .then(result => {
        console.log(result)
    })
})

app.post("/:id", (req, res) => {
    const todoId = req.params.id;
    const updatedTodo = req.body.todoValue;
  
    Todo.findByIdAndUpdate({ _id: todoId }, { todo: updatedTodo })
    .then(() => {
        res.redirect("/");
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error al actualizar la información.');
    });
  });

app.patch('/:id', (req, res) => {
    const todoId = req.params.id;
    const todoValue = req.body.todoValue;
  
    Todo.findByIdAndUpdate(todoId, { todo: todoValue }, { new: true })
    .then(updatedTodo => {
        if (!updatedTodo) {
        res.status(404).send('Tarea no encontrado.');
        return;
        }
  
        console.log(updatedTodo);
        res.redirect('/');
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error al actualizar la Tarea.');
    });
  });

app.listen(port, () => {
    console.log("server is running on port" + port)
})
