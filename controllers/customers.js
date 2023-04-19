import { pool } from "../database/index.js";

export const getAllClients = (req, res) => {
  const userId = req.params.user_id;

  const query = `
       SELECT user_clients.id, first_name as firstName, second_name as secondName, third_name as thirdName, 
       CONCAT(user_clients.first_name, ' ', user_clients.second_name, ' ', user_clients.third_name) as fullName, premium, phone
        FROM user_clients INNER JOIN users on users.id = user_clients.user_id WHERE users.id = ${userId}`;

  pool.query(query, (error, results) => {
    if (!error) {
      res.json({ customers: results });
    } else {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
};

export const deleteClient = (req, res) => {
  const clientId = req.params.client_id;

  pool.query(
    `DELETE from user_clients WHERE user_clients.id = ${clientId}`,
    (error, results) => {
      if (!error) {
        res.json({ isDeleted: true });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  );
};

export const addClient = (req, res) => {
  const { firstName, secondName, thirdName, premium, phone } = req.body;

  const userId = req.userId;

  
  pool.query(
    `INSERT INTO user_clients (first_name, second_name, third_name, phone, premium, user_id) 
    VALUES ('${firstName}', '${secondName}', '${thirdName}', '${phone}' ,  ${
      premium ? 1 : 0
    }, ${userId})`,
    (error, results) => {
      if (!error) {
        const query = `
        SELECT user_clients.id FROM user_clients 
        INNER JOIN users on users.id = user_clients.user_id WHERE users.id = ${userId} AND third_name='${thirdName}' AND second_name='${secondName}'`;

        pool.query(query, (error, results) => {
          if (!error) {
            res.json({ customerId: results[0].id });
          } else {
            console.log(error);
            res.status(500).json({ error: error.message });
          }
        });
      } else {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    }
  );
};

export const updateClient = (req, res) => {
  const { firstName, secondName, thirdName, premium, phone, clientId } =
    req.body;

  console.log(firstName);

  pool.query(
    `UPDATE user_clients SET first_name = '${firstName}', second_name = '${secondName}',
     third_name = '${thirdName}', premium = ${
      premium ? 1 : 0
    }, phone = '${phone}' WHERE user_clients.id = ${clientId}`,
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

export const searchClients = (req, res) => {

  const { secondName, searchWithPremium, premium } = req.query;


  const userId = req.params.user_id;
  let isSearchWithPremiumActive = searchWithPremium === "true";

  let q;
  if (isSearchWithPremiumActive) {
    q = `
      SELECT user_clients.id, first_name as firstName, second_name as secondName, third_name as thirdName, premium, phone FROM user_clients 
      INNER JOIN users on users.id = user_clients.user_id 
      WHERE users.id = ${userId} AND user_clients.second_name LIKE '%${secondName}%' AND user_clients.premium = ${+premium}`;
  } else {
    q = `
    SELECT user_clients.id, first_name as firstName, second_name as secondName, third_name as thirdName, premium, phone FROM user_clients 
    INNER JOIN users on users.id = user_clients.user_id 
    WHERE users.id = ${userId} AND user_clients.second_name LIKE '%${secondName}%'`;
  }

  pool.query(q, (error, results) => {
    if (!error) {
      res.json({ clients: results });
    } else {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
};