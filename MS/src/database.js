import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;

export function createDatabasePool() {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  return pool;
}

export async function saveTransaction(userId, orderId, createdAt, totalValue) {
  const connection = await pool.getConnection();
  
  try {
    const [result] = await connection.execute(
      `INSERT INTO transactions (user_id, order_id, created_at, total_value, processed_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [userId, orderId, createdAt, totalValue]
    );
    
    console.log(`✅ Transaction saved for order ${orderId}`);
    return result;
  } catch (error) {
    console.error(`❌ Error saving transaction for order ${orderId}:`, error);
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateOrderStatus(orderId, status) {
  const connection = await pool.getConnection();
  
  try {
    await connection.execute(
      `UPDATE orders SET status = ?, processed_at = NOW() WHERE id = ?`,
      [status, orderId]
    );
    
    console.log(`✅ Order ${orderId} status updated to ${status}`);
  } catch (error) {
    console.error(`❌ Error updating order status for ${orderId}:`, error);
    throw error;
  } finally {
    connection.release();
  }
}

export async function closeDatabasePool() {
  if (pool) {
    await pool.end();
    console.log('🔌 Database pool closed');
  }
}
