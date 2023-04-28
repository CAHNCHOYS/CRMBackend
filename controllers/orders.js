import { pool } from "../database/index.js";

export const getAllOrders = (req, res) => {
  const userId = req.params.user_id;


  const query = `SELECT user_orders.id, DATE_FORMAT(date, "%d-%m-%Y") as date, CONCAT(user_clients.first_name, ' ' , user_clients.second_name, ' ', user_clients.third_name) as customerFullName, 
  user_orders.product_count as productCount, products.name as productName, products.id as productId, user_clients.id as customerId
    FROM user_orders INNER JOIN users ON users.id = user_orders.user_id
       INNER JOIN products ON user_orders.product_id = products.id INNER JOIN user_clients ON user_clients.id = user_orders.client_id
       WHERE user_orders.user_id = ${userId};
    `;

  pool.query(query, (err, results) => {
    if (!err) {
      res.json({ orders: results });
    } else {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  });
};

export const addOrder = (req, res) => {
  const userId = req.userId;
  const { customerId, productId, productCount, date } = req.body;

  let query = `INSERT INTO user_orders (client_id, user_id, product_id,product_count, date)
   VALUES (${customerId}, ${userId}, ${productId}, ${productCount}, '${date}')`;

  pool.query(query, (error, results) => {
    if (!error) {
      query = `SELECT user_orders.id,  CONCAT(user_clients.first_name, ' ' , user_clients.second_name, ' ', user_clients.third_name) as customerFullName,     
        products.name as productName    FROM user_orders INNER JOIN users ON users.id = user_orders.user_id
           INNER JOIN products ON user_orders.product_id = products.id INNER JOIN user_clients ON user_clients.id = user_orders.client_id
           WHERE user_orders.user_id = ${userId} AND user_orders.product_count = ${productCount} AND user_orders.product_id = ${productId} AND user_orders.client_id = ${customerId}
            LIMIT 1`;

      pool.query(query, (error, results) => {
        if (!error) {
          res.json(results[0]);
        } else {
          console.log(error);
          res.status(500).json({ error: error.message });
        }
      });
    } else {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
};

export const deleteOrder = (req, res) => {
  const orderId = req.params.order_id;
  pool.query(
    `DELETE FROM user_orders WHERE id=${orderId}`,
    (error, results) => {
      if (!error) {
        res.json({ isDeleted: true });
      } else {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    }
  );
};

export const updateOrder = (req, res) => {
  const userId = req.userId;
  const { customerId, productId, productCount, date, orderId } = req.body;

  let query = `UPDATE user_orders SET product_id = ${productId}, product_count = ${productCount}, date='${date}', client_id = ${customerId}
   WHERE user_orders.id = ${orderId}`;

  pool.query(query, (error, results) => {
    if (!error) {
      query = `SELECT user_orders.id, CONCAT(user_clients.first_name, ' ', user_clients.second_name, ' ', user_clients.third_name) as customerFullName,     
      products.name as productName
      FROM user_orders INNER JOIN users ON users.id = user_orders.user_id
         INNER JOIN products ON user_orders.product_id = products.id INNER JOIN user_clients ON user_clients.id = user_orders.client_id
         WHERE user_orders.user_id = ${userId} AND user_orders.product_count = ${productCount} AND user_orders.product_id = ${productId}  AND user_orders.client_id = ${customerId}
          LIMIT 1`;

      pool.query(query, (error, results) => {
        if (!error) {
          res.json(results[0]);
        } else {
          console.log(error);
          res.status(500).json({ error: error.message });
        }
      });
    } else {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
};

export const searchOrders = (req, res) => {
  const userId = req.params.user_id;

  const { startDate, endDate, product, customer } = req.query;

  const query = `SELECT orders.*, DATE_FORMAT(orders.date, "%d-%m-%Y") as date FROM (SELECT user_orders.id, user_orders.date, CONCAT(user_clients.first_name, ' ' , user_clients.second_name, ' ' , user_clients.third_name) as customerFullName, 
  products.count as productCount, products.name as productName, products.id as productId, user_clients.id as customerId
    FROM user_orders INNER JOIN users ON users.id = user_orders.user_id
       INNER JOIN products ON user_orders.product_id = products.id INNER JOIN user_clients ON user_clients.id = user_orders.client_id WHERE users.id = ${userId}) as orders
       WHERE orders.productName LIKE '%${
         product ? product : ""
       }%' AND orders.customerFullName LIKE '%${customer ? customer : ""}%'
       AND orders.date BETWEEN '${startDate}' AND '${endDate}'`;

  pool.query(query, (error, results) => {
    if (!error) {
      res.json({ orders: results });
    } else {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
};
