import express from 'express';
import jwt from 'express-jwt';
import JWT_SECRET from '../config/jwt';

const router = express.Router();

// Login-only test
router.get('/test', jwt({ secret: JWT_SECRET }), (req, res) => {
  res.status(200).json({ success: true });
});

module.exports = router;
