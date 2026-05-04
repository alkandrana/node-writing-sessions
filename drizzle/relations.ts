import { relations } from "drizzle-orm/relations";
import { projects, scenes, sessions } from "./schema";

export const scenesRelations = relations(scenes, ({one, many}) => ({
	project: one(projects, {
		fields: [scenes.projectId],
		references: [projects.id]
	}),
	sessions: many(sessions),
}));

export const projectsRelations = relations(projects, ({many}) => ({
	scenes: many(scenes),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	scene: one(scenes, {
		fields: [sessions.sceneId],
		references: [scenes.id]
	}),
}));