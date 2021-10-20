const express = require("express");
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const { v4: uuid } = require('uuid');

// Parse form-urlencoded information
app.use(express.urlencoded({ extended: true }))

app.use(express.json())

// Override using a query value (POST having ?_method=PATCH/DELETE)
app.use(methodOverride('_method'))

// Static assets
app.use(express.static(path.join(__dirname, 'public')))

// 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// Fake data
let tasks = [
    {
        id: uuid(),
        username: 'Maev',
        task: 'Buy milk'
    },
    {
        id: uuid(),
        username: 'Maev',
        task: 'Call mom'
    },
    {
        id: uuid(),
        username: 'Maev',
        task: 'Walk dog'
    },
    {
        id: uuid(),
        username: 'Maev',
        task: 'Take out trash'
    }
]

app.get('/tasks', (req, res) => {
    res.render('tasks/index', { tasks })
})

app.get('/tasks/new', (req, res) => {
    res.render('tasks/new')
})

app.post('/tasks', (req, res) => {
    const { username, task } = req.body;
    tasks.push({ username, task, id: uuid() });
    res.redirect('/tasks')
})

app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const task = tasks.find(task => task.id === id);
    res.render('tasks/show', { task })
})

app.get('/tasks/:id/edit', (req, res) => {
    const { id } = req.params;
    const task = tasks.find(task => task.id === id);
    res.render('tasks/edit', { task })
})

app.patch('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const updatedTask = req.body.task;
    const foundTask = tasks.find(task => task.id === id);
    foundTask.task = updatedTask;
    res.redirect('/tasks')
})

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(task => task.id !== id);
    res.redirect('/tasks')
})

app.get('*', (req, res) => {
    res.send("Error:  Path does not exist!")
})

app.listen(3000, () => {
    console.log("Listening on port 3000!")
})

// RESTful routes
// GET /tasks - list all tasks
// GET /tasks/new - form to create a new task
// POST /tasks - create a new task
// GET /tasks/:id - view details of one task
// GET /tasks/:id/edit - form to update one task
// PATCH /tasks/:id - update one task
// DELETE /tasks/:id - destroy one task