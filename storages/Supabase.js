
const { createClient } = require('@supabase/supabase-js')
const imageToBase64 = require('image-to-base64');



class Supabase {
    constructor(name, image) {
        this.name = name
        this.image = image
        // this.thumb = thumb
        const supabaseUrl = process.env.SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_KEY
        const supabase = createClient(supabaseUrl, supabaseKey)
        this.supabase = supabase
    }

    async upload() {

        const { data, error } = await this.supabase
            .storage
            .from(process.env.BUCKET_NAME)
            .upload(process.env.IMAGES_DIR + '/' + this.name, this.image, {
                cacheControl: '3600',
                upsert: false,
                contentType: 'image/webp'
            })



        if (error) return { success: false, error: error, code: 400 }
        return { success: true, data: data }
    }

    getLink() {
        const { data } = this.supabase
            .storage
            .from(process.env.BUCKET_NAME)
            .getPublicUrl(process.env.IMAGES_DIR + '/' + this.name)

        return { image: data.publicURL }
    }

    async download(name) {
        const imageUrl = process.env.IMAGE_URL
        const url = imageUrl + '/' + process.env.BUCKET_NAME + '/' + process.env.IMAGES_DIR + '/' + name

        const downloadPromise = () => new Promise((resolve, reject) => {
            imageToBase64(url) // Image URL
                .then(
                    (response) => {
                        if(response.length<200) reject('cannot get image')
                        const base64image = response
                        resolve(base64image)
                    }
                )
                .catch(
                    (error) => {
                        reject(error)
                    }
                )
        })

        try {
            const base64image = await downloadPromise()
            return {success: true, data: base64image}
        } catch (error) {
            return {success: false, code: 400, error: error}
        }

    }
}

module.exports = Supabase