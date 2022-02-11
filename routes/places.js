const express = require('express')
const router = express.Router({ mergeParams: true })

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')

const Place = require('../models/place')
const Review = require('../models/review')
const { isLoggedIn, isAuthor, validatePlace } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

const controller = require('../controllers/places')

router
    .route('/')
    .get(catchAsync(controller.index))
    .post(
        isLoggedIn,
        upload.array('image'),
        validatePlace,
        catchAsync(controller.new)
    )
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files)
//     res.send('ok')
// })

router.get('/new', isLoggedIn, catchAsync(controller.renderNew))
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(controller.renderEdit))

router
    .route('/:id')
    .get(catchAsync(controller.show))
    .put(
        isLoggedIn,
        isAuthor,
        upload.array('image'),
        validatePlace,
        catchAsync(controller.edit)
    )
    .delete(isLoggedIn, isAuthor, catchAsync(controller.delete))

module.exports = router
