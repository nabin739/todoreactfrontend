// express.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware to enable CORS
const port = 8000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mern-app')
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((err) => {
        console.log("Failed to connect to MongoDB", err.message);
    });

// Creating the schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
    },
    description: String
});

// Creating the model
const todoModel = mongoose.model('Todo', todoSchema);

// POST route - create a new todo
app.post('/todo', async (req, res) => {
    const { title, description } = req.body;

    try {
        const newTodo = new todoModel({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// GET route - fetch all todos
app.get('/todo', async (req, res) => {
    try {
        const todos = await todoModel.find(); // You missed fetching from database
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
 //update a todo


 app.put('/todo/:id',async(req,res) =>{

     try{
    const {title, description} = req.body;
    const  id  = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(id,
        {title,description},
        {new:true});
   
    
    if(!updatedTodo){
        return res.status(404).json({message: "Todo not found"});
    }       
    res.json(updatedTodo);
}
catch(err){
    console.error(err);
    res.status(500).json({message: err.message});
}
 })

 //delete a todo

 app.delete('/todo/:id',async(req,res) => {
    try{
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch{
        console.log(err);
    res.status(500).json({message: err.message});

    }
 })



// Start the server
app.listen(port, () => {
    console.log("Server is running successfully on port " + port);
});
