import { pool } from "../database/index.js";

export const getUserNotes = (req, res) => {
  const userId = req.params.user_id;
  console.log(userId);
  pool.query(
    `SELECT user_notes.id, title,  type  FROM (user_notes INNER JOIN users ON users.id = user_notes.user_id)  WHERE users.id = ${userId}`,
    (error, results) => {
      if (!error) {
        res.json({ notes: results });
      } else {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    }
  );
};

export const updateUserNote = (req, res) => {
  const { id, title, type } = req.body;

  
  pool.query(
    `UPDATE user_notes SET type = '${type}', title = '${title}' WHERE id = ${+id}`,
    (error, results) => {
      if (!error) {
        console.log(results);
        res.json({ isUpdated: true });
      } else {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    }
  );
};

export const deleteNote = (req, res) => {
  const noteId = req.params.note_id;
  console.log("noteId", noteId);

  pool.query(
    `DELETE FROM user_notes WHERE id = ${noteId}`,
    (error, results) => {
      if (!error) {
        res.json({ isDeleted: true });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  );
};

export const addNote = (req, res) => {

  const { title, type, userId } = req.body;

  pool.query(
    `INSERT INTO user_notes  (title, type, user_id) VALUES ('${title}', '${type}', ${userId})`,
    (error, results) => {
      if (!error) {
        pool.query(
          `SELECT user_notes.id, title,  type  FROM (user_notes INNER JOIN users ON users.id = user_notes.user_id)  WHERE users.id = ${userId} AND title = '${title}' AND type='${type}'`,
          (error, results) => {
            if (!error) {
              res.json({ noteId: results[0].id });
            } else {
              console.log(error);
              res.status(500).json({ error: error.message });
            }
          }
        );
      } else {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    }
  );
};
