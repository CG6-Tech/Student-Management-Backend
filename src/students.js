const express = require("express");
const router = express.Router();
const { getConnection } = require('../connection'); // Assuming you have the getConnection function from your previous code

router.post('/', async (req, res) => {
  try {
    const connection = await getConnection();
    const { firstName, lastName, studentLevel, gpa, email, birthdate } = req.body;
    const result = await connection.execute(
      `INSERT INTO Students (first_name, last_name, st_level, gpa, email, bdate) VALUES (:1, :2, :3, :4, :5, TO_DATE(:6, 'YYYY-MM-DD'))`,
      [ firstName, lastName, studentLevel, gpa, email, birthdate ]
    );

    console.log("Create Student ===> ", result);
    res.status(201).send('Student created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating student');
  }
});

router.get('/', async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute('SELECT * FROM Students');

    const columnNames = result.metaData.map(column => column.name);

    const students = result.rows.map(row => {
      const student = {};
      columnNames.forEach((columnName, index) => {
        student[columnName] = row[index];
      });
      return student;
    });

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching students');
  }
});

router.get('/:bid', async (req, res) => {
  try {
    const connection = await getConnection();
    const bid = req.params.bid;
    const result = await connection.execute('SELECT * FROM Students WHERE bid = :1', [bid]);
    if (result.rows.length === 0) {
      res.status(404).send('Student not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching student');
  }
});

router.put('/:bid', async (req, res) => {
  try {
    const connection = await getConnection();
    const { first_name, last_name, st_level, gpa, email, bdate } = req.body;
    const bid = req.params.bid;
    const result = await connection.execute(
      `UPDATE Students SET first_name = :1, last_name = :2, st_level = :3, gpa = :4, email = :5, bdate = TO_DATE(:6, 'YYYY-MM-DD') WHERE bid = :7`,
      [first_name, last_name, st_level, gpa, email, bdate, bid]
    );
    if (result.rowsAffected === 0) {
      res.status(404).send('Student not found');
    } else {
      res.send('Student updated successfully');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating student');
  }
});

router.delete('/:bid', async (req, res) => {
  try {
    const connection = await getConnection();
    const bid = req.params.bid;
    const result = await connection.execute('DELETE FROM Students WHERE bid = :1', [bid]);
    if (result.rowsAffected === 0) {
      res.status(404).send('Student not found');
    } else {
      res.send('Student deleted successfully');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting student');
  }
});

module.exports = router;
