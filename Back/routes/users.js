import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import models from '../models';
import JWT_SECRET from '../config/jwt';
import { convertPostsResult } from '../utils/posts';
import convertCommentsResult from '../utils/comments';

const router = express.Router();

// Common function to generate JWT
function getJWTToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '720h' });
}

// Register
router.post('/register', (req, res) => {
  // Check request body
  req.checkBody('username', 'Username required').notEmpty();
  req.checkBody('email', 'Valid email required').isEmail();
  req.checkBody('password', 'Password required').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return;
  }

  // Generate password hash and salt
  const passwordSalt = crypto.randomBytes(128).toString('base64');
  crypto.pbkdf2(req.body.password, passwordSalt, 100000, 64, 'sha512', (err, derivedKey) => {
    if (err) throw err;
    const passwordHash = derivedKey.toString('hex');

    // Add user
    models.User.create({
      username: req.body.username,
      email: req.body.email,
      password_hash: passwordHash,
      password_salt: passwordSalt,
    }).then((user) => {
      // Return a JWT
      const generatedToken = getJWTToken(user);
      res.status(200).json({ token: generatedToken });
    })
      .catch(() => { res.status(500).json({ success: false, error: 'Cannot register user' }); });
  });
});


// Login
router.post('/login', (req, res) => {
  // Check request body
  req.checkBody('username', 'Username required').notEmpty();
  req.checkBody('password', 'Password required').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return;
  }

  // Get user
  models.User.findOne({ where: { username: req.body.username } }).then(
    (user) => {
      if (user === null) {
        res.status(400).json({ success: false, error: 'Invalid username and/or password' });
        return;
      }
      crypto.pbkdf2(req.body.password, user.password_salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) throw err;
        const passwordHash = derivedKey.toString('hex');

        // Compare password
        if (passwordHash === user.password_hash) {
          // Generate JWT token
          const generatedToken = getJWTToken(user);
          res.status(200).json({ token: generatedToken });
        } else {
          res.status(400).json({ success: false, error: 'Invalid username and/or password' });
        }
      });
    },
    // On error
    () => {
      res.status(400).json({ success: false, error: 'Invalid username and/or password' });
    },
  );
});

// Get an user profile
router.get('/profile', (req, res) => {
  // Check request query param
  if (typeof (req.query.username) === 'undefined' || req.query.username === null) {
    res.status(400).json({ success: false, error: 'Query parameter "username" is required' });
    return;
  }

  // Get user
  models.User.findOne({
    where: { username: req.query.username },
  }).then(
    async (user) => {
      if (user === null) {
        res.status(400).json({ success: false, error: 'Invalid username' });
        return;
      }

      // If user is valid, also get the posts and comments karma
      const votes = await models.Vote.findAll({
        include: [{
          model: models.Post,
          required: true,
        }],
        where: { '$Post.userId$': user.id },
        attributes: [[models.sequelize.fn('SUM', models.sequelize.col('score')), 'total']],
      });
      const comsVotes = await models.CommentVote.findAll({
        include: [{
          model: models.Comment,
          required: true,
        }],
        where: { '$Comment.userId$': user.id },
        attributes: [[models.sequelize.fn('SUM', models.sequelize.col('score')), 'total']],
      });

      res.status(200).json({
        username: user.username,
        registerDate: user.createdAt,
        postsKarma: votes[0].dataValues.total === null ? 0 : votes[0].dataValues.total,
        commentsKarma: comsVotes[0].dataValues.total === null ? 0 : comsVotes[0].dataValues.total,
      });
    },
    // On error
    () => {
      res.status(400).json({ success: false, error: 'Cannot get user profile' });
    },
  );
});

// Get latests posts for a specific user
router.get('/posts', (req, res) => {
  // Check request query params
  if (typeof (req.query.username) === 'undefined' || req.query.username === null) {
    res.status(400).json({ success: false, error: 'Query parameter "username" is required' });
    return;
  }

  models.User.findOne({
    where: { username: req.query.username },
  }).then(
    async (user) => {
      if (user === null) {
        res.status(400).json({ success: false, error: 'Invalid username' });
        return;
      }

      // If user is valid, get the posts
      const posts = await models.Post.findAll({
        where: { userId: user.id },
        include: [{
          model: models.Category,
          required: true,
        },
        {
          model: models.User,
          required: true,
        },
        {
          model: models.Vote,
          required: false,
        }],
        limit: 10,
        order: [['createdAt', 'DESC']],
      });

      res.status(200).json(convertPostsResult(posts));
    },
    // On error
    () => {
      res.status(400).json({ success: false, error: 'Cannot get user posts' });
    },
  );
});


// Get latests comments for a specific user
router.get('/comments', (req, res) => {
  // Check request query params
  if (typeof (req.query.username) === 'undefined' || req.query.username === null) {
    res.status(400).json({ success: false, error: 'Query parameter "username" is required' });
    return;
  }

  models.User.findOne({
    where: { username: req.query.username },
  }).then(
    async (user) => {
      if (user === null) {
        res.status(400).json({ success: false, error: 'Invalid username' });
        return;
      }

      // If user is valid, also get the posts and comments karma
      const comments = await models.Comment.findAll({
        where: { userId: user.id },
        attributes: { include: ['parentId'] },
        include: [
          {
            model: models.User,
            required: true,
          },
          {
            model: models.Post,
            required: true,
          },
          {
            model: models.CommentVote,
            required: false,
          },
        ],
        limit: 10,
        order: [['createdAt', 'DESC']],
      });

      res.status(200).json(convertCommentsResult(comments, true));
    },
    // On error
    () => {
      res.status(400).json({ success: false, error: 'Cannot get user comments' });
    },
  );
});

module.exports = router;
