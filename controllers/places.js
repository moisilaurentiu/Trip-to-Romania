const Place = require('../models/place')
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')

const mbxToken = process.env.MAPBOX_TOKEN

const geocoder = mbxGeocoding({ accessToken: mbxToken })

exports.index = async (req, res) => {
    const places = await Place.find({})
    res.render('places/index', { places })
}

exports.renderNew = async (req, res) => {
    res.render('places/new')
}

exports.new = async (req, res) => {
    const response = await geocoder
        .forwardGeocode({
            query: req.body.place.location,
            limit: 1
        })
        .send()

    const place = new Place(req.body.place)
    place.author = req.user._id
    place.images = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }))
    place.geometry = response.body.features[0].geometry
    console.log('place', place)
    await place.save()
    req.flash('success', 'Successfully made a new place')
    res.redirect(`/places/${place._id}`)
}

exports.show = async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author')
    console.log(place)
    if (!place) {
        req.flash('error', 'Cannot find place')
        return res.redirect('/places')
    }
    res.render('places/show', { place })
}

exports.renderEdit = async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id)
    if (!place) {
        req.flash('error', 'Cannot find place')
        return res.redirect('/places')
    }
    res.render('places/edit', { place })
}

exports.edit = async (req, res) => {
    const { id } = req.params
    console.log(req.body)
    const place = await Place.findByIdAndUpdate(id, req.body.place)
    const imgs = req.files.map(file => {
        return { url: file.path, filename: file.filename }
    })
    place.images.push(...imgs)
    await place.save()
    if (req.body.deleteImages?.length) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await place.updateOne({
            $pull: {
                images: {
                    filename: {
                        $in: req.body.deleteImages
                    }
                }
            }
        })
    }
    req.flash('success', 'Successfully edited place')
    res.redirect(`/places/${place._id}`)
}

exports.delete = async (req, res) => {
    const { id } = req.params
    await Place.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted place')
    res.redirect(`/places`)
}
