export default function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Something went wrong on the server' });
}
