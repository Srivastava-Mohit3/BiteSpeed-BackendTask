import { Client } from "pg";

const connectDB = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "root",
  database: "BiteSpeed",
});

export default connectDB;