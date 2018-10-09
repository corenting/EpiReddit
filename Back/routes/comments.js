import express from 'express';
import jwt from 'express-jwt';
import models from '../models';
import convertCommentsResult from '../utils/comments';
import JWT_SECRET from '../config/jwt';

const router = express.Router();

// Create comment endpoint
router.post('/comment', jwt({ secret: JWT_SECRET }), (req, res) => {
  // Check request body
  req.checkBody('post_id', 'Post identifier required').isInt();
  req.checkBody('content', 'Content required').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return;
  }

  // Insert in db
  models.Comment.create({
    UserId: req.user.id,
    PostId: req.body.post_id,
    content: req.body.content,
    ParentId: req.body.parent_id,
  }).then(() => { res.status(200).json({ success: true }); })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, error: 'Cannot create comment' });
    });
});

// Common function to get comments for a post
async function getComments(req, res) {
  // Check post_id parameter
  if (typeof (req.query.post_id) === 'undefined' || req.query.post_id === null) {
    res.status(400).json({ success: false, error: 'Query parameter "post_id" is required' });
    return;
  }

  try {
    let comments = await models.Comment.findAll({
      attributes: { include: ['parentId'] },
      where: { postId: req.query.post_id },
      include: [
        {
          model: models.User,
          required: true,
        },
        {
          model: models.CommentVote,
          required: false,
        },
      ],
    });

    // Add upvote/downvote boolean if user is logged in
    if (typeof (req.user) !== 'undefined') {
      comments = comments.map((item) => {
        const newItem = item;
        newItem.upvote = false;
        newItem.downvote = false;
        if (typeof (newItem.CommentVotes) !== 'undefined') {
          const userVote = newItem.CommentVotes.find(elt => elt.UserId === req.user.id);
          if (typeof (userVote) !== 'undefined' && userVote !== null) {
            newItem.upvote = userVote.score === 1;
            newItem.downvote = userVote.score === -1;
          }
        }
        return newItem;
      });
    }

    // Fix ORM bug
    comments = comments.map((item) => {
      const newItem = item;
      newItem.ParentId = item.dataValues.parentId;
      return newItem;
    });

    res.status(200).json(convertCommentsResult(comments, false));
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: 'Cannot get comments' });
  }
}


// Get comments for a  post (with auth and votes)
router.get('/forPostWithUserVotes', jwt({ secret: JWT_SECRET }), (req, res) => {
  getComments(req, res);
});

// Get comments for a post (without auth and votes)
router.get('/forPost', (req, res) => {
  getComments(req, res);
});

module.exports = router;
