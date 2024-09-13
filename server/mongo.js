const mongoose = require("mongoose")
mongoose.connect('mongodb+srv://mcvicky2601:hLAgJklGdJqMZvE3@todo.ivcvl.mongodb.net/?retryWrites=true&w=majority&appName=ToDo')
    .then(() => {
        console.log("Mongo Connected...")
    })
    .catch(() => {
        console.log("Failed to connect MongoDB...")
    })


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });


const eventSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    events: [{
        time: String,
        date: String,
        description: String
    }]
}, { timestamps: true });


const goalsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    goal: [{
        _id: mongoose.Schema.Types.ObjectId,
        description: String,
        month: String,
    }]
}, { timestamps: true });


const taskSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    tasks: [{
        name: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'done'],
            default: 'pending'
        },
        label: {
            type: String
        },
        due: {
            type: Date
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });


const noteSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    notes: [{
        name: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
}, { timestamps: true });


const userCollection = mongoose.model("userCollection", userSchema)
const eventCollection = mongoose.model("eventCollection", eventSchema)
const goalsCollection = mongoose.model("goalsCollection", goalsSchema)
const taskCollection = mongoose.model("taskCollection", taskSchema)
const notesCollection = mongoose.model("notesCollection", noteSchema)



const collection = {
    userCollection,
    eventCollection,
    goalsCollection,
    taskCollection,
    notesCollection,
}

module.exports = collection