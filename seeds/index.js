const mongoose = require('mongoose')
const Place = require('../models/place')
const Review = require('../models/review')

const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/trip-to-romania', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log('connected to mongodb')
})

const sample = arr => {
    return arr[Math.floor(Math.random() * arr.length)]
}

const seedDB = async () => {
    await Review.deleteMany({})
    await Place.deleteMany({})

    for (let i = 0; i < 40; i++) {
        const city = sample(cities)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Place({
            author: '61ebfbe74be16a4466216ee3',
            location: `${city.city}, ${city.state}`,
            geometry: {
                coordinates: [city.longitude, city.latitude],
                type: 'Point'
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: '',
                    filename: ''
                },
                {
                    url: '',
                    filename: ''
                },
                {
                    url: '',
                    filename: ''
                }
            ],
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae numquam, ex aspernatur sint, itaque minima dolorum vel iure quae explicabo quas enim quaerat officia id odit. Ipsa hic corrupti ut.',
            price
        })
        await camp.save()
    }
}

seedDB().then(() => mongoose.connection.close())
