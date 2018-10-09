import express from 'express';
import jwt from 'express-jwt';
import models from '../models';
import { getPostHotness } from '../utils/posts';

import JWT_SECRET from '../config/jwt';

const router = express.Router();

// Vote for a post
router.post('/post', jwt({ secret: JWT_SECRET }), (req, res) => {
  // Check request body
  req.checkBody('post_id', 'Post identifier required').isInt();
  req.checkBody('upvote', 'Upvote state required').isBoolean();
  req.checkBody('downvote', 'Downvote state required').isBoolean();
  const errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return;
  }

  // Check if there is already a vote
  models.Vote.findOne({ where: { userId: req.user.id, postId: req.body.post_id } }).then(
    (vote) => {
      models.sequelize.transaction(async (t) => {
        let success = false;
        if (vote === null) {
          // Create vote entry if no votes yet
          await models.Vote.create({
            UserId: req.user.id,
            PostId: req.body.post_id,
            score: req.body.upvote ? 1 : (req.body.downvote ? -1 : 0),
          }, { transaction: t });
          success = true;
        } else {
          await models.Vote.update(
            { score: req.body.upvote ? 1 : (req.body.downvote ? -1 : 0) },
            { where: { userId: req.user.id, postId: req.body.post_id }, transaction: t },
          );
          success = true;
        }

        // Return if error
        if (!success) {
          res.status(500).json({ success: false, error: 'Cannot vote post' });
          return;
        }

        // Else update post hotness then return
        const post = await models.Post.findOne({
          where: { id: req.body.post_id },
          include: {
            model: models.Vote,
            required: false,
          },
          transaction: t,
        });
        const newHotness = getPostHotness(post);
        await models.Post.update(
          { hotness: newHotness },
          { where: { id: req.body.post_id }, transaction: t },
        );
      }).then(() => { res.status(200).json({ success: true }); })
        .catch(() => { res.status(500).json({ success: false, error: 'Cannot vote post' }); });
    },
    // On error try to create new vote
    () => { res.status(500).json({ success: false, error: 'Cannot vote post' }); },
  );
});

// Vote for a comment
router.post('/comment', jwt({ secret: JWT_SECRET }), (req, res) => {
  // Check request body
  req.checkBody('comment_id', 'Comment identifier required').isInt();
  req.checkBody('upvote', 'Upvote state required').isBoolean();
  req.checkBody('downvote', 'Downvote state required').isBoolean();
  const errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return;
  }

  // Check if there is already a vote
  models.CommentVote.findOne({
    where: { userId: req.user.id, commentId: req.body.comment_id },
  }).then(
    (vote) => {
      models.sequelize.transaction(async (t) => {
        let success = false;
        if (vote === null) {
          // Create vote entry if no votes yet
          await models.CommentVote.create({
            UserId: req.user.id,
            CommentId: req.body.comment_id,
            score: req.body.upvote ? 1 : (req.body.downvote ? -1 : 0),
          }, { transaction: t });
        } else {
          // Else edit vote
          await models.CommentVote.update(
            { score: req.body.upvote ? 1 : (req.body.downvote ? -1 : 0) },
            { where: { userId: req.user.id, commentId: req.body.comment_id }, transaction: t },
          );
        }

        success = true;

        // Error check
        if (!success) {
          res.status(500).json({ success: false, error: 'Cannot vote comment' });
        } else {
          // res.status(200).json({ success: true, comment });
          res.status(200).json({ success: true });
        }
      }).catch(() => { res.status(500).json({ success: false, error: 'Cannot vote comment' }); });
    },
    // On error try to create new vote
    () => { res.status(500).json({ success: false, error: 'Cannot vote comment' }); },
  );
});

module.exports = router;
