import { migrate } from "drizzle-orm/mysql2/migrator";
import {db} from './index.js';

async function main() {
    // This looks at your 'out' folder from drizzle.config.ts
    await migrate(db, { migrationsFolder: "./drizzle" });

    console.log("✅ Migrations applied successfully!");
}

main().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
