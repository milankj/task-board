import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export async function up(queryInterface, Sequelize) {
  const password = await bcrypt.hash("Admin@123", 10);
  await queryInterface.bulkInsert("users", [
    {
      user_id: randomUUID(),
      name: "Admin Test",
      email: "admin@test.com",
      password: password,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("users", {
    email: "admin@test.com"
  });
}
