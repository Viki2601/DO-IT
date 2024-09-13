require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const { userCollection, eventCollection, taskCollection, notesCollection, goalsCollection } = require('./mongo');
const PORT = process.env.PORT || 8000;


const app = express();
app.use(express.json());
app.use(cors());


async function hashPass(password) {
    const res = await bcrypt.hash(password, 10);
    return res;
}
async function compare(userPass, hashPass) {
    const res = await bcrypt.compare(userPass, hashPass);
    return res;
}


app.get('/user/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const user = await userCollection.findOne({ email });
        res.json(user);
    } catch (e) {
        console.log(e)
    };
});


app.post("/signup", async (req, res) => {
    const form = req.body.form;
    const data = {
        name: form.username,
        email: form.email,
        password: await hashPass(form.password),
    };
    try {
        const check = await userCollection.findOne({ email: form.email })
        if (check) {
            res.json("exists")
        }
        else {
            res.json("notexists")
            await userCollection.insertMany([data])
        }
    } catch (e) {
        res.json("Failed...")
    };
});


app.post("/login", async (req, res) => {
    const formData = req.body.formData;
    try {
        const check = await userCollection.findOne({ email: formData.email });

        if (check) {
            const passCheck = await compare(formData.password, check.password);
            passCheck ? res.json("loginPass") : res.json("loginFail");
        } else {
            res.json("nouser");
        };
    } catch (e) {
        res.json("fail");
    };
});


app.post("/sendEmail", async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.OTP;
        const check = await userCollection.findOne({ email: email });
        if (check) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: 'access.ecourse78@gmail.com',
                    pass: process.env.MY_EMAIL_PASS
                }
            });
            const mailOption = {
                from: "Daily Activities | TODO",
                to: email,
                subject: "Password reset request OTP",
                text: `OTP to reset your Password ${otp}`,
            };
            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    res.json('fail');
                } else {
                    res.json('pass');
                };
            });
        } else {
            res.json('notexists');
        };
    } catch (e) {
        res.json('fail');
    };
});


app.post("/resetPassword", async (req, res) => {
    const email = req.body.cookieVal;
    const password = req.body.password;
    try {
        const newPass = await hashPass(password);
        await userCollection.updateOne(
            { email: email },
            { $set: { password: newPass } }
        );
        res.json("pass");
    } catch (e) {
        res.json("fail");
    };
});


app.post("/addNewNote", async (req, res) => {
    const { email, name } = req.body.note;
    try {
        const user = await notesCollection.findOne({ email });
        if (user) {
            await notesCollection.updateOne(
                { email },
                { $push: { notes: { name } } }
            );
            res.json({ notes: [...user.notes, { name }] });
        } else {
            const newUser = {
                email,
                notes: [{ name }],
            };
            await notesCollection.insertMany(newUser);
            res.json({ notes: [{ name }] });
        }
    } catch (error) {
        console.log(error)
        res.json({ message: 'Server error' });
    };
});


app.get("/getNotes/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const user = await notesCollection.findOne({ email });
        if (user) {
            res.json({ notes: user.notes });
        } else {
            res.json({ notes: [] });
        }
    } catch (error) {
        console.log(error);
        res.json({ message: 'Server error' });
    };
});


app.post("/addNewTask", async (req, res) => {
    const { email, name, status, label, due } = req.body.task;
    try {
        const user = await taskCollection.findOne({ email });
        if (user) {
            await taskCollection.updateOne(
                { email },
                { $push: { tasks: { name, status, label, due } } }
            );
            res.json({ tasks: [...user.tasks, { name, status, label, due }] });
        } else {
            const newUser = {
                email,
                tasks: [{ name, status, label, due }]
            };
            await taskCollection.insertMany(newUser);
            res.json({ tasks: [{ name, status, label, due }] });
        }
    } catch (error) {
        console.log(error);
        res.json({ message: 'Server error' });
    };
});


app.get("/getTasks/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const user = await taskCollection.findOne({ email });
        if (user) {
            res.json({ tasks: user.tasks });
        } else {
            res.json({ tasks: [] });
        }
    } catch (error) {
        console.log(error);
    };
});


app.put('/updateTaskStatus/:id', async (req, res) => {
    try {
        const { status, email } = req.body;

        const user = await taskCollection.findOne({ email });
        const task = user.tasks.id(req.params.id)
        task.status = status;
        await user.save();
        res.json(task);
    } catch (error) {
        res.json('Failed to update task');
    }
});


app.post("/addEvents", async (req, res) => {
    const { email, date, time, description } = req.body;
    try {
        const userEvents = await eventCollection.findOne({ email });
        if (userEvents) {
            userEvents.events.push({ date, time, description });
        } else {
            userEvents = new Event({
                email,
                events: [{ date, time, description }]
            });
        }
        await userEvents.save();
        res.json(userEvents.events);
    } catch (err) {
        res.json({ error: err.message });
    };
});


app.get('/getEvents', async (req, res) => {
    const { email, date } = req.query;
    try {
        const userEvents = await eventCollection.findOne({ email });
        if (userEvents) {
            const eventsForDate = userEvents.events.filter(event => event.date === date);
            res.json(eventsForDate);
        } else {
            res.json([]);
        }
    } catch (err) {
        console.log(err)
        res.json({ error: err.message });
    }
});


app.post("/addGoals", async (req, res) => {
    const { email, description, month } = req.body;
    try {
        const user = await goalsCollection.findOne({ email });
        if (user) {
            await goalsCollection.updateOne(
                { email },
                { $push: { goal: { description, month } } }
            );
            res.json({ goals: [...user.goal, { description, month }] });
        } else {
            const newUser = {
                email,
                goals: [{ description, month }]
            };
            await goalsCollection.insertMany(newUser);
            res.json(newUser.goals);
        };
    } catch (err) {
        console.log(err)
    };
});


app.get("/getGoals/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const user = await goalsCollection.findOne({ email });
        if (user) {
            res.json({ goals: user.goal });
        } else {
            res.json({ goals: [] })
        }
    } catch (error) {
        console.log(error);
    };
})


app.put("/updateGoal", async (req, res) => {
    const { email, goalId, description } = req.body;
    try {
        const updatedGoal = await goalsCollection.findOneAndUpdate(
            { email: email, 'goal._id': goalId },
            { $set: { 'goal.$.description': description } },
            { new: true }
        );
        if (updatedGoal) {
            res.json({ goal: updatedGoal });
        } else {
            res.json({ message: 'Goal not found' });
        }
    } catch (error) {
        res.json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log("Port Connected...")
})
