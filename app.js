const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const studentRouter = require("./src/students");
const classesRouter = require("./src/classes");
const courseRouter = require("./src/course");
const enrollmentsRouter = require("./src/enrollments");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(cors());

app.use('/students', studentRouter)
app.use('/classes', classesRouter)
app.use('/course', courseRouter)
app.use('/enrollments', enrollmentsRouter)

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
