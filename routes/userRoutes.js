const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updateLoggedInUserPassword',
  authController.protect,
  authController.updateLoggedInUserPassword
);

router.patch(
  '/updateCurrentUser',
  authController.protect,
  userController.updateCurrentUser
);

router.delete(
  '/disableCurrentUser',
  authController.protect,
  userController.disableCurrentUser
);

router
  .route('')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUserByID)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
