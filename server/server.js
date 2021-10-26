const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) =>
	res.json({
		msg: 'Welcome to the fakebook API',
	})
);

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use(
	'/api/notifications',
	require('./routes/notifications')
);

// Error Handling
app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).send(err.message);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
	console.log(`Server started on ${PORT}`)
);
