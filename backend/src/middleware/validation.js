const { body, query, param, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Validation for problem tags
const validateProblemTags = [
  query('tags')
    .notEmpty()
    .withMessage('Tags parameter is required')
    .isString()
    .withMessage('Tags must be a string'),
  handleValidationErrors
];

// Validation for saving problem attempt
const validateProblemAttempt = [
  body('contestId')
    .notEmpty()
    .withMessage('contestId is required')
    .isString()
    .withMessage('contestId must be a string'),
  body('problemIndex')
    .notEmpty()
    .withMessage('problemIndex is required')
    .isString()
    .withMessage('problemIndex must be a string'),
  body('problemName')
    .notEmpty()
    .withMessage('problemName is required')
    .isString()
    .withMessage('problemName must be a string'),
  body('solved')
    .isBoolean()
    .withMessage('solved must be a boolean'),
  body('timeTaken')
    .optional()
    .isInt({ min: 0 })
    .withMessage('timeTaken must be a positive integer'),
  handleValidationErrors
];

// Validation for bookmarking problems
const validateBookmarkProblem = [
  body('contestId')
    .notEmpty()
    .withMessage('contestId is required')
    .isString()
    .withMessage('contestId must be a string'),
  body('problemIndex')
    .notEmpty()
    .withMessage('problemIndex is required')
    .isString()
    .withMessage('problemIndex must be a string'),
  body('problemName')
    .notEmpty()
    .withMessage('problemName is required')
    .isString()
    .withMessage('problemName must be a string'),
  handleValidationErrors
];

// Validation for code review
const validateCodeReview = [
  body('code')
    .notEmpty()
    .withMessage('Code is required')
    .isString()
    .withMessage('Code must be a string'),
  body('language')
    .optional()
    .isString()
    .withMessage('Language must be a string'),
  handleValidationErrors
];

// Validation for user preferences
const validateUserPreferences = [
  body('defaultTags')
    .optional()
    .isArray()
    .withMessage('defaultTags must be an array'),
  body('defaultTags.*')
    .optional()
    .isString()
    .withMessage('Each tag must be a string'),
  body('difficultyRange.min')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum difficulty must be a positive integer'),
  body('difficultyRange.max')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum difficulty must be a positive integer'),
  handleValidationErrors
];

// Validation for pagination parameters
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('solved')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Solved must be either "true" or "false"'),
  handleValidationErrors
];

module.exports = {
  validateProblemTags,
  validateProblemAttempt,
  validateBookmarkProblem,
  validateCodeReview,
  validateUserPreferences,
  validatePagination,
  handleValidationErrors
};