const Supabase = require("./Supabase")
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const sizeOf = require('buffer-image-size');


class StorageFactory {

    constructor(name=null) {
        this.base64image = null
        this.uuid = uuidv4()
        this.name = name? name:  this.uuid + '.webp'
        this.image = null
        this.thumb = null
    }

    async #resizeImage(image, options) {
        const promise = () => new Promise((resolve, reject) => {
            sharp(image)
                .resize(options)
                .toBuffer()
                .then(data => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                });
        })

        try {
            const result = await promise()
            return { success: true, data: result }
        } catch (error) {
            return { success: false, error: error, code: 400 }
        }

    }

    #getOptions(dimensions, max_dim) {
        const width = dimensions.width
        const height = dimensions.height
        let options = { width: width, height: height }
        if (width > max_dim) options = { width: Number(max_dim) }
        else if (height > max_dim) options = { height: Number(max_dim) }

        return options
    }

    async compile(base64image) {
        this.base64image = base64image
        const decodedImage = Buffer.from(base64image, 'base64');
        const webpImage = await sharp(decodedImage)
            .webp({ lossless: true })
            .toBuffer();

        const dimensions = sizeOf(webpImage)
        const imageOptions = this.#getOptions(dimensions, process.env.MAX_IMAGE_DIM)

        const resizedImageResullt = await this.#resizeImage(webpImage, imageOptions)
        const resizedImage = resizedImageResullt.data
        this.image = resizedImage
    }

    initiate = (type) => {
        return new Supabase(this.name, this.image)
    }

    async resize(base64image, size = 256) {

        const decodedImage = Buffer.from(base64image, 'base64');
        const webpImage = await sharp(decodedImage)
            .webp({ lossless: true })
            .toBuffer();

        const dimensions = sizeOf(webpImage)
        let imageOptions = this.#getOptions(dimensions, process.env.MAX_IMAGE_DIM)

        if (size < process.env.MAX_IMAGE_DIM) {
            imageOptions = this.#getOptions(dimensions, size)

        }
        const resizedImageResullt = await this.#resizeImage(webpImage, imageOptions)
        const resizedImage = resizedImageResullt.data
        this.image = resizedImage
        this.base64image = base64image
    }
}

module.exports = StorageFactory