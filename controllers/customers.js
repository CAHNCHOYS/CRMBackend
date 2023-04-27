import { pool } from "../database/index.js";

export const getAllClients = (req, res) => {
  const userId = req.params.user_id;

  const query = `
       SELECT user_clients.id, first_name as firstName, second_name as secondName, third_name as thirdName, 
       CONCAT(user_clients.first_name, ' ', user_clients.second_name, ' ', user_clients.third_name) as fullName, CASE WHEN premium = 1 THEN 'Да' ELSE 'Нет' END as premium,
       phone
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
  const customerId = req.params.client_id;

  pool.query(
    `DELETE from user_clients WHERE user_clients.id = ${customerId}`,
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

  console.log(req.body);
  const userId = req.userId;

  pool.query(
    `INSERT INTO user_clients (first_name, second_name, third_name, phone, premium, user_id) 
    VALUES ('${firstName}', '${secondName}', '${thirdName}', '${phone}' ,  ${
      premium === "Да" ? 1 : 0
    }, ${userId})`,
    (error, results) => {
      if (!error) {
        console.log(results.insertId);
        res.json({ customerId: results.insertId });
        // console.log(results);
        // const query = `
        // SELECT user_clients.id FROM user_clients 
        // INNER JOIN users on users.id = user_clients.user_id 
        // WHERE users.id = ${userId} AND third_name='${thirdName}' AND second_name='${secondName}' AND phone = '${phone}' LIMIT 1`;

        // pool.query(query, (error, results) => {
        //   if (!error) {
        //     res.json({ customerId: results[0].id });
        //   } else {
        //     console.log(error);
        //     res.status(500).json({ error: error.message });
        //   }
        // });
      } else {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    }
  );
};

export const updateClient = (req, res) => {
  const { firstName, secondName, thirdName, premium, phone, customerId } =
    req.body;

  console.log(firstName);

  pool.query(
    `UPDATE user_clients SET first_name = '${firstName}', second_name = '${secondName}',
     third_name = '${thirdName}', premium = ${
      premium === "Да" ? 1 : 0
    }, phone = '${phone}' WHERE user_clients.id = ${customerId}`,
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

  console.log(isSearchWithPremiumActive);
  console.log(premium);
  let q;
  if (isSearchWithPremiumActive) {
    q = `
      SELECT * FROM (SELECT user_clients.id, first_name as firstName, second_name as secondName, third_name as thirdName, CONCAT(user_clients.first_name, ' ', user_clients.second_name, ' ', user_clients.third_name) as fullName, 
       premium, phone FROM user_clients 
      INNER JOIN users on users.id = user_clients.user_id  WHERE users.id = ${userId}) as customers
       WHERE  customers.fullName LIKE '%${
         secondName ? secondName : ""
       }%' AND customers.premium = ${+premium}`;
  } else {
    q = `
    SELECT * FROM (SELECT user_clients.id, first_name as firstName, second_name as secondName, third_name as thirdName, CONCAT(user_clients.first_name, ' ', user_clients.second_name, ' ', user_clients.third_name) as fullName, 
        CASE WHEN premium = 1 THEN 'Да' ELSE 'Нет' END as premium, phone FROM user_clients 
      INNER JOIN users on users.id = user_clients.user_id  WHERE users.id = ${userId}) as customers
       WHERE  customers.fullName LIKE '%${secondName ? secondName : ""}%'`;
  }

  pool.query(q, (error, results) => {
    if (!error) {
      console.log(results);
      res.json({ customers: results });
    } else {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
};
