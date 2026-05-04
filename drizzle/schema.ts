import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, bigint, varchar, int, foreignKey, mysqlEnum, index, date, timestamp } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const projects = mysqlTable("projects", {
	id: bigint({ mode: "number" }).autoincrement().notNull(),
	code: varchar({ length: 5 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	seriesTitle: varchar("series_title", { length: 255 }),
	goal: int().default(0).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "projects_id"}),
	unique("code").on(table.code),
]);

export const scenes = mysqlTable("scenes", {
	id: bigint({ mode: "number" }).autoincrement().notNull(),
	code: varchar({ length: 5 }).notNull(),
	sequence: int(),
	name: varchar({ length: 255 }),
	words: int().default(0),
	status: mysqlEnum(['pending','writing','finished','aborted']).default('pending').notNull(),
	projectId: bigint("project_id", { mode: "number" }).references(() => projects.id),
},
(table) => [
	primaryKey({ columns: [table.id], name: "scenes_id"}),
	unique("code").on(table.code),
]);

export const sessions = mysqlTable("sessions", {
	id: bigint({ mode: "number" }).autoincrement().notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	date: date({ mode: 'string' }).notNull(),
	startTime: timestamp("start_time", { mode: 'string' }),
	stopTime: timestamp("stop_time", { mode: 'string' }),
	words: int().notNull(),
	sceneId: bigint("scene_id", { mode: "number" }).notNull().references(() => scenes.id),
	comments: varchar({ length: 255 }),
},
(table) => [
	index("IX_sessions_date").on(table.date),
	index("IX_sessions_scene_date").on(table.sceneId, table.date),
	primaryKey({ columns: [table.id], name: "sessions_id"}),
]);
