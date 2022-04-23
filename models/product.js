const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema(
    {
        projectName: String,
        version: String,
        details: String,
        byteArray: Buffer
    }
)

module.exports = mongoose.model('Product',productSchema)