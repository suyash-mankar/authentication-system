const express = require('express');
const router = express.router();

router.get('/', homeController.home);


module.exports = router;