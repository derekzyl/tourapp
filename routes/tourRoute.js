/** @format */

const express = require('express');
// const { resource } = require('../app');
const tourRouter = express.Router();
const tourController = require('../controllers/tourController');

// tourRouter.param('id', tourController.checkId);

/**
 * The Tour Route
 *  ------------------------
 * @type get, post
 */

tourRouter
  .route('/top-5-cheap') 
  .get(tourController.aliasTopTours, tourController.GetAll);

tourRouter.route('/tour-stats')
  .get(tourController.getTourStats);


tourRouter.route('/monthly/:year').get(tourController.getMonthlyPlan);


tourRouter
  .route('/')
  .get(tourController.GetAll)
  .post(tourController.createTour);

/**
 * Id Tour Route
 * --------------
 * this are route that comes with @params and @patch comes with  @body
 */
tourRouter
  .route('/:id')
  .get(tourController.GetSome)
  .patch(tourController.Patch)
  .delete(tourController.Delete);

module.exports = tourRouter;
