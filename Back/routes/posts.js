import express from 'express';
import jwt from 'express-jwt';
import models from '../models';
import { mapUpvotesOnPost, convertPostsResult } from '../utils/posts';
import getImageResolver from '../utils/pictures';
import JWT_SECRET from '../config/jwt';

const router = express.Router();

function getPosts(req, res) {
  // Check page, sort and category parameters
  if (typeof (req.query.page) === 'undefined' || req.query.page === null) {
    res.status(400).json({ success: false, error: 'Query parameter "page" is required' });
    return;
  }
  if (typeof (req.query.sort) === 'undefined' || req.query.sort === null) {
    res.status(400).json({ success: false, error: 'Query parameter "sort" is required' });
    return;
  }
  if (typeof (req.query.category) === 'undefined' || req.query.category === null) {
    res.status(400).json({ success: false, error: 'Query parameter "category" is required' });
    return;
  }

  // Build sequelize query
  const queryOpts = {
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
    offset: req.query.page * 15,
    limit: 15,
  };

  // If not frontpage, return only for the specified category
  if (req.query.category !== 'frontpage') {
    queryOpts.where = { '$Category.name$': req.query.category };
  }

  // Apply sort
  if (req.query.sort === 'new') {
    queryOpts.order = [['createdAt', 'DESC']];
  } else {
    queryOpts.order = [['hotness', 'DESC'], ['createdAt', 'DESC']]; // by default sort by hotness
  }

  models.Post
    .findAll(queryOpts)
    .then((result) => {
      let newResult = result;
      // Add upvote/downvote boolean if user is logged in
      if (typeof (req.user) !== 'undefined') {
        newResult = result.map(item => mapUpvotesOnPost(item, req));
      }
      res.status(200).json(convertPostsResult(newResult));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, error: 'Cannot get posts' });
    });
}

function getSpecificPost(req, res) {
  // Check page, sort and category parameters
  if (typeof (req.query.post_id) === 'undefined' || req.query.post_id === null) {
    res.status(400).json({ success: false, error: 'Query parameter "post_id" is required' });
    return;
  }

  // Build sequelize query
  const queryOpts = {
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
    where: { id: req.query.post_id },
  };

  models.Post
    .findOne(queryOpts)
    .then((result) => {
      let newResult = result;
      // Add upvote/downvote boolean if user is logged in
      if (typeof (req.user) !== 'undefined') {
        newResult = mapUpvotesOnPost(newResult, req);
      }
      res.status(200).json(convertPostsResult([newResult])[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, error: 'Cannot get posts' });
    });
}

// Create link post
router.post('/link', jwt({ secret: JWT_SECRET }), (req, res) => {
  // Check category in request body
  req.checkBody('category_id', 'Category required').isInt();
  req.checkBody('title', 'Title required').notEmpty();
  req.checkBody('link', 'Link required').isURL();
  const errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return;
  }

  // Resolve picture then add
  const resolver = getImageResolver();
  resolver.resolve(req.body.link, (imageResolverResult) => {
    if (imageResolverResult && imageResolverResult.image.trim()) {
      models.Post.create({
        title: req.body.title,
        UserId: req.user.id,
        CategoryId: req.body.category_id,
        link: req.body.link,
        picture: imageResolverResult.image,
        hotness: 0,
      }).then((post) => { res.status(200).json({ success: true, post_id: post.id }); })
        .catch(() => { res.status(500).json({ success: false, error: 'Cannot create post' }); });
    } else {
      res.status(500).json({ success: false, error: 'Cannot create post' });
    }
  });
});

// Create self post
router.post('/selfpost', jwt({ secret: JWT_SECRET }), (req, res) => {
  // Check category in request body
  req.checkBody('category_id', 'Category required').isInt();
  req.checkBody('title', 'Title required').notEmpty();
  req.checkBody('content', 'Content required').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return;
  }

  models.Post.create({
    title: req.body.title,
    UserId: req.user.id,
    CategoryId: req.body.category_id,
    content: req.body.content,
    hotness: 0,
  }).then((post) => { res.status(200).json({ success: true, post_id: post.id }); })
    .catch(() => { res.status(500).json({ success: false, error: 'Cannot create post' }); });
});

// Get posts (with auth and votes)
router.get('/listWithUserVotes', jwt({ secret: JWT_SECRET }), (req, res) => {
  getPosts(req, res);
});

// Get posts (without auth and votes)
router.get('/list', (req, res) => {
  getPosts(req, res);
});

router.get('/postWithUserVotes', jwt({ secret: JWT_SECRET }), (req, res) => {
  getSpecificPost(req, res);
});

router.get('/post', (req, res) => {
  getSpecificPost(req, res);
});

module.exports = router;
