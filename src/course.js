const express = require("express");
const router = express.Router();
const { getConnection } = require('../connection');

router.post('/', async (req, res) => {
  try {
    const connection = await getConnection();
    const { dept_code, course, title } = req.body;
    const result = await connection.execute(
      `INSERT INTO Courses (dept_code, course#, title) VALUES (:1, :2, :3)`,
      [dept_code, course, title]
    );
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
    res.json(result.rows);
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
