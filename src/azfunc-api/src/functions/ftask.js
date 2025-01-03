const mysql = require('mysql2/promise');
const { app } = require('@azure/functions');

// Configuration de la base de données
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
};

app.http('tasks', {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`HTTP function processed request for url "${request.url}"`);
        context.log(`Request method: ${request.method}`);
        const connection = await mysql.createConnection(dbConfig);

        try {
            // Ajout d'une tâche
            if (request.method === 'POST') {
                context.log('Handling POST /tasks');
                const body = await request.json();
                const { description } = body;

                if (!description) {
                    return { status: 400, body: 'Description is required' };
                }

                const [result] = await connection.execute(
                    'INSERT INTO todo.tasks (description) VALUES (?)',
                    [description]
                );
                return { status: 201, body: { id: result.insertId, description } };
            }

            // Lecture de toutes les tâches
            if (request.method === 'GET') {
                context.log('Handling GET /tasks');
                const [rows] = await connection.execute('SELECT * FROM todo.tasks');
                return { status: 200, body: JSON.stringify(rows) };
            }

            // Suppression d'une tâche
            if (request.method === 'DELETE') {
                context.log('Handling DELETE /tasks');
                const taskId = request.query.get('id');
                if (!taskId) {
                    return { status: 400, body: 'Task ID is required' };
                }

                await connection.execute('DELETE FROM todo.tasks WHERE id = ?', [taskId]);
                return { status: 200, body: `Task with ID ${taskId} deleted` };
            }

            // Mise à jour d'une tâche
            if (request.method === 'PUT') {
                context.log('Handling PUT /tasks');
                const body = await request.json();
                const { id, description } = body;

                if (!id || !description) {
                    return { status: 400, body: 'Task ID and description are required' };
                }

                await connection.execute(
                    'UPDATE todo.tasks SET description = ? WHERE id = ?',
                    [description, id]
                );
                return { status: 200, body: `Task with ID ${id} updated` };
            }

            return { status: 404, body: 'Not Found' };
        } catch (error) {
            context.log(`Error: ${error.message}`);
            return { status: 500, body: 'Internal Server Error' };
        } finally {
            await connection.end();
        }
    }
});