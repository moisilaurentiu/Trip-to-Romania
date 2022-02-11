const schemas = require('./schemas')

const ExpressError = require('./utils/ExpressError')

const Place = require('./models/place')
const Review = require('./models/review')

exports.validatePlace = (req, res, next) => {
    const { error } = schemas.placeSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    }

    next()
}

exports.validateReview = (req, res, next) => {
    const { error } = schemas.reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    }

    next()
}

exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    return next()
}

exports.isAuthor = async (req, res, next) => {
    const { id } = req.params

    const place = await Place.findById(id)

    if (!place.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permissions to do that')
        return res.redirect(`/places/${id}`)
    }
    return next()
}

exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params

    const review = await Review.findById(reviewId)

    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permissions to do that')
        return res.redirect(`/places/${id}`)
    }
    return next()
}
