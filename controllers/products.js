import { pool } from "../database/index.js";

export const getAllUserProducts = (req, res) => {
  const user_id = req.params.user_id;
  console.log("userID", user_id);
  const q = `SELECT products.id, products.name, products.price, products.count, categories.name as category, categories.id as categoryId
  FROM ((products    INNER JOIN categories ON categories.id = products.category_id) 
  INNER JOIN users ON users.id = products.user_id)  WHERE products.user_id = ${+user_id}`;

  pool.query(q, (error, results) => {
    if (!error) {
      res.json({ products: results });
    } else {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
};

export const deleteProduct = (req, res) => {
  const product_id = req.params.product_id;

  pool.query(
    `DELETE FROM products WHERE products.id = ${+product_id}`,
    (error, results) => {
      if (!error) {
        res.json({ isProductDeleted: true });
      } else {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    }
  );
};

export const getProductsCategories = (req, res) => {
  pool.query("SELECT * from categories", (error, results) => {
    if (!error) {
      res.json({ categories: results });
    } else {
      res.status(500).json({ error: error.message });
    }
  });
};

export const updateUserProduct = (req, res) => {
  const { name, count, price, productId, categoryId } = req.body;
  const userId = req.userId;
  
  console.log(userId, "userid");
  pool.query(
    `UPDATE products SET name = '${name}', price = ${price}, category_id = ${categoryId}, count = ${count} WHERE products.id = ${productId}`,
    (error, results) => {
      if (!error) {
        res.json({ isUpdated: true });
      } else {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    }
  );
};

export const addUserProduct = (req, res) => {
  const { name, price, categoryId, count } = req.body;

  const userId = req.userId;

  pool.query(
    `INSERT INTO products (name, price, category_id, user_id, count) 
   VALUES ('${name}', '${price}', '${categoryId}', '${userId}', '${count}')`,
    (error, results) => {
      if (!error) {
         res.json({productId: results.insertId});
      } else {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    }
  );
};

export const searchProducts = (req, res) => {
  console.log("query", req.query);

  const { name, startPrice, endPrice } = req.query;

  const userId = req.params.user_id;

  const q = `SELECT products.id, products.name, products.price, products.count, categories.name as category, categories.id as categoryId
  FROM ((products    INNER JOIN categories ON categories.id = products.category_id) 
  INNER JOIN users ON users.id = products.user_id) 
   WHERE products.user_id = ${userId} AND products.price>=${+startPrice} AND products.price<= ${+endPrice} 
   AND products.name LIKE '%${name ? name : ""}%'
  `;

  pool.query(q, (error, results) => {
    if (!error) {
      console.log(results);
      res.json({ products: results });
    } else {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
};
