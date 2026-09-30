export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("tasks", {

    tasks_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    task_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    story_point: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    priority: {
      type: Sequelize.ENUM('critical', 'high', 'medium', 'low'),
      allowNull: false,
    },
    owner_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    planned_date: {
      type: Sequelize.DATE,
    },
    due_date: {
      type: Sequelize.DATE,
    },
    status: {
      type: Sequelize.ENUM('backlog', 'planned', 'progress', 'completed'),
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

  await queryInterface.addConstraint("tasks", {
    fields: ["story_point"],
    type: "check",
    name: "tasks_story_point_positive",
    where: {
      story_point: {
        [Sequelize.Op.gt]: 0,
      },
    },
  });

}

export async function down(queryInterface) {
  await queryInterface.dropTable("tasks");
}
