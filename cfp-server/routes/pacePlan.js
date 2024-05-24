const express = require('express');
const { validateRequest } = require('../middleware/validateRequest');
const pacePlan = require('../models/pacePlan');
const router = express.Router();

// Get endpoint
router.get('/pacePlan', async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  res.status(200).json(pacePlan);
});

module.exports = router;