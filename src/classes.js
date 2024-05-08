const express = require("express");
const router = express.Router();
const { getConnection } = require('../connection');

router.post('/', async (req, res) => {
  try {
    const connection = await getConnection();
    const { classid, dept_code, courseNumber, sectionNumber, year, semester, limit, classSize, room } = req.body;
    const query = `INSERT INTO Classes (classid, dept_code, course#, sect#, year, semester, limit, class_size, room) VALUES ('${classid}', '${dept_code}', ${courseNumber}, ${sectionNumber}, ${year}, '${semester}', ${limit}, ${classSize}, '${room}')`;

    console.log(query)
    const result = await connection.execute(query);
    console.log(result)
    res.status(201).send('Class created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating class');
  }
});

router.get('/', async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute('SELECT * FROM Classes');

    const columnNames = result.metaData.map(column => column.name);

    const classes = result.rows.map(row => {
      const uclass = {};
      columnNames.forEach((columnName, index) => {
        uclass[columnName] = row[index];
      });
      return uclass;
    });

    res.json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching classes');
  }
});

router.get('/:classid', async (req, res) => {
  try {
    const connection = await getConnection();
    const classid = req.params.classid;
    const result = await connection.execute('SELECT * FROM Classes WHERE classid = :1', [classid]);
    if (result.rows.length === 0) {
      res.status(404).send('Class not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching class');
  }
});

router.put('/:classid', async (req, res) => {
  try {
    const connection = await getConnection();
    const { dept_code, course, sect, year, semester, limit, class_size, room } = req.body;
    const classid = req.params.classid;
    const result = await connection.execute(
      `UPDATE Classes SET dept_code = :1, course# = :2, sect# = :3, year = :4, semester = :5, limit = :6, class_size = :7, room = :8 
      WHERE classid = :9`,
      [dept_code, course, sect, year, semester, limit, class_size, room, classid]
    );
    if (result.rowsAffected === 0) {
      res.status(404).send('Class not found');
    } else {
      res.send('Class updated successfully');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating class');
  }
});

router.delete('/:classid', async (req, res) => {
  try {
    const connection = await getConnection();
    const classid = req.params.classid;
    const result = await connection.execute('DELETE FROM Classes WHERE classid = :1', [classid]);
    if (result.rowsAffected === 0) {
      res.status(404).send('Class not found');
    } else {
      res.send('Class deleted successfully');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting class');
  }
});

module.exports = router;
