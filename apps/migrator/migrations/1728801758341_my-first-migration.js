/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createExtension("uuid-ossp", { ifNotExists: true });
  pgm.createTable("tasks", {
    id: { type: "uuid", primaryKey: true, notNull: true },
    title: { type: "text", notNull: true },
    description: { type: "text", notNull: true },
    status: { type: "text", notNull: true },
    updated_at: {
      type: "timestamp",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
    },
  });
  pgm.createTable("users", {
    id: { type: "uuid", primaryKey: true, notNull: true },
    email: { type: "text", notNull: true },
    updated_at: {
      type: "timestamp",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
    },
  });
  pgm.createTable("sessions", {
    id: { type: "uuid", primaryKey: true, notNull: true },
    userId: {
      type: "uuid",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("tasks");
  pgm.dropTable("users");
  pgm.dropTable("sessions");
  pgm.dropExtension("uuid-ossp");
};
