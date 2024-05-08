const express = require("express");
const { fetchGEnrollments } = require("./proc");
const router = express.Router();

router.get('/get', async (req, res) => {
  try {
    const enrollments = await fetchGEnrollments();
    res.json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).send('Error fetching enrollments');
  }
});

router.get('students/drop/:g_number/:grad_c_id', async (req, res) => {
  const { g_number, grad_c_id } = req.params;
  try {
    await dropStudentFromClass(g_number, grad_c_id);
    res.send('Student dropped from class successfully');
  } catch (error) {
    console.error('Error dropping student from class:', error);
    res.status(500).send('Error dropping student from class');
  }
});

module.exports = router;