const { getConnection } = require('../connection');
const oracledb = require('oracledb');

async function fetchGEnrollments() {
    let connection;
    try {
        connection = await getConnection();

        const bindVars = {
            Out_Cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        };

        const result = await connection.execute(`BEGIN fetch_g_enrollments(:Out_Cursor); END;`, bindVars);

        const resultSet = result.outBinds.Out_Cursor;

        let rows = [];
        let row;
        while ((row = await resultSet.getRow())) {
            rows.push(row);
        }

        await resultSet.close();

        return rows;
    } catch (error) {
        console.error(error);
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
        throw error;
    }
}

async function dropStudentFromClass(g_number, grad_c_id) {
    let connection;
    try {
      connection = await getConnection();
  
      // Bind parameters
      const bindVars = {
        g_number: g_number,
        grad_c_id: grad_c_id
      };
  
      // Execute the procedure
      await connection.execute('BEGIN drop_student_from_class(:g_number, :grad_c_id); END;', bindVars);
  
      console.log('Student dropped from class successfully');
    } catch (error) {
      console.error('Error dropping student from class:', error);
    } finally {
      // Release the connection
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error('Error closing connection:', error);
        }
      }
    }
  }

module.exports = { fetchGEnrollments, dropStudentFromClass };
