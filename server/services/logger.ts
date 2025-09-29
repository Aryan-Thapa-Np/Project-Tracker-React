import pool from "../database/db.ts";

const actions: string[] = [
    "User successfully authenticated",
    "User + Email successfully authenticated",
    "A new project was created",
    "A task was marked as completed",
    "status was updated to 'To Do'",
    "status was updated to 'In Progress'",
    "status was updated to 'Completed'",
    "A password reset was performed",
    "User profile information was updated",
];

export const insertLog = async (
    userId: number,
    username: string,
    actionIndex: number,
    more:string = ""
): Promise<void> => {
    try {
        // Validate inputs
        if (!userId || !username?.trim()) {
            throw new Error("Invalid log parameters: missing user ID or username.");
        }
        if (actionIndex < 0 || actionIndex >= actions.length) {
            throw new Error(`Invalid action index: ${actionIndex}`);
        }

        const action = more +" " + actions[actionIndex];

        const query = `
      INSERT INTO logs (user_id, username, action)
      VALUES (?, ?, ?)
    `;

        await pool.execute(query, [userId, username, action]);


    } catch (err) {
        console.error(" Failed to insert log:", err);

    }
};
