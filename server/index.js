import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';

dotenv.config();

const port = Number(process.env.PORT) || 5000;

await connectDB();

const server = app.listen(port, () => {
	console.log(`Node server is running on port ${port}`);
});

server.on('error', (error) => {
	if (error.code === 'EADDRINUSE') {
		console.error(`Port ${port} is already in use. Stop the existing process or change PORT in server/.env.`);
		process.exit(1);
	}

	console.error('Server failed to start:', error.message);
	process.exit(1);
});
