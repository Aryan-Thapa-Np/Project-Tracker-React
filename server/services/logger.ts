import pool from "../database/db.ts";

const actions: string[] = [
    "User successfully authenticated", //0
    "User + Email successfully authenticated", //1
    "A new project was created",  //2
    "A task was marked as completed", //3
    "status was updated to 'To Do'", //4
    "status was updated to 'In Progress'", //5
    "status was updated to 'Completed'", //6
    "A password reset was performed", //7
    "profile information was updated",  //8
    "Was Created successfully",  //9
    "." //10
];

export const insertLog = async (
    userId: number,
    username: string,
    actionIndex: number,
    more: string = ""
): Promise<void> => {
    try {
        // Validate inputs
        if (!userId || !username?.trim()) {
            throw new Error("Invalid log parameters: missing user ID or username.");
        }
        if (actionIndex < 0 || actionIndex >= actions.length) {
            throw new Error(`Invalid action index: ${actionIndex}`);
        }

        const action = more + " " + actions[actionIndex];

        const query = `
      INSERT INTO logs (user_id, username, action)
      VALUES (?, ?, ?)
    `;

        await pool.execute(query, [userId, username, action]);


    } catch (err) {
        console.error(" Failed to insert log:", err);

    }
};
