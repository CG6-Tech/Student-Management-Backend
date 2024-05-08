const express = require("express");
const router = express.Router();
const { getConnection } = require('../connection');

router.post('/', async (req, res) => {
  try {
    const connection = await getConnection();
    const { dept_code, courseNumber, title } = req.body;
    const query = `INSERT INTO Courses (dept_code, course#, title) VALUES ('${dept_code}', ${courseNumber}, '${title}')`;
    const result = await connection.execute(query);

    console.log(result);
    res.status(201).send('Course created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating course');
  }
});

router.get('/', async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute('SELECT * FROM Courses');
    
    const columnNames = result.metaData.map(column => column.name);
    
    const courses = result.rows.map(row => {
      const course = {};
      columnNames.forEach((columnName, index) => {
        course[columnName] = row[index];
      });
      return course;
    });

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching courses');
  }
});

router.get('/:dept_code/:course', async (req, res) => {
  try {
    const connection = await getConnection();
    const { dept_code, course } = req.params;
    const result = await connection.execute(
      'SELECT * FROM Courses WHERE dept_code = :1 AND course# = :2',
      [dept_code, course]
    );
    if (result.rows.length === 0) {
      res.status(404).send('Course not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching course');
  }
});

router.put('/:dept_code/:course', async (req, res) => {
  try {
    const connection = await getConnection();
    const { title } = req.body;
    const { dept_code, course } = req.params;
    const result = await connection.execute(
      'UPDATE Courses SET title = :1 WHERE dept_code = :2 AND course# = :3',
      [title, dept_code, course]
    );
    if (result.rowsAffected === 0) {
      res.status(404).send('Course not found');
    } else {
      res.send('Course updated successfully');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating course');
  }
});

router.delete('/:dept_code/:course', async (req, res) => {
  try {
    const connection = await getConnection();
    const { dept_code, course } = req.params;
    const result = await connection.execute(
      'DELETE FROM Courses WHERE dept_code = :1 AND course# = :2',
      [dept_code, course]
    );
    if (result.rowsAffected === 0) {
      res.status(404).send('Course not found');
    } else {
      res.send('Course deleted successfully');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting course');
  }
});

module.exports = router;
