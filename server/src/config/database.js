import { Sequelize } from "sequelize";

export const db_config = {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
};

export const sequelize = new Sequelize(
    db_config.database,
    db_config.username,
    db_config.password,
    {
        host: db_config.host,
        port: db_config.port,
        dialect: "mysql",
        logging: false,
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
};
