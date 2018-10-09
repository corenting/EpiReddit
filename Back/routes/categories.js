import express from 'express';
import models from '../models';

const router = express.Router();

// Get all categories
router.get('/', (req, res) => {
  models.Category.findAll().then(
    (categories) => {
      res.status(200).json(categories.map(item => ({ id: item.id, name: item.name })));
    },
    // On error
    () => { res.status(500).json({ success: false, error: 'Cannot get categories' }); },
  );
});

module.exports = router;
