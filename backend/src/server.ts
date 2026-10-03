import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`⚡️ PlayTogether Backend API is running on http://localhost:${PORT}`);
  console.log(`🔗 Health check available at http://localhost:${PORT}/health`);
});
