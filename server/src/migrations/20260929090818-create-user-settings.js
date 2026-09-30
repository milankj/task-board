export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("user_settings", {

    settings_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    user_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    daily_point_limit: {
      type: Sequelize.INTEGER,
    },

    weekly_point_limit: {
      type: Sequelize.INTEGER,
    },

    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("user_settings");
}
