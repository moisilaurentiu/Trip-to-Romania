const Place = require('../models/place')
const Review = require('../models/review')

exports.new = async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    place.reviews.push(review)
    await review.save()
    await place.save()
    req.flash('success', 'Successfully created new review')
    res.redirect(`/places/${id}`)
}

exports.delete = async (req, res) => {
    const { id, reviewId } = req.params
    await Review.findByIdAndDelete(req.params.reviewId)
    await Place.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    })

    req.flash('success', 'Successfully deleted review')
    res.redirect(`/places/${id}`)
}
