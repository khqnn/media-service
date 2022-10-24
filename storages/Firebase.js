
const { createClient } = require('@supabase/supabase-js')


class Firebase {
    constructor(name, image, thumb) {
        this.name = name
        this.image = image
        this.thumb = thumb
    }

    async upload() {
        //     const imageDir = 'image/'
        //     const thumbDir = 'thumb/'
        //     const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG)

        //     const base64image = req.body.base64

        //     const decodedImage = new Buffer.from(base64image, 'base64');


        //     const name = uuidv4() + '.png'
        //     const app = initializeApp(firebaseConfig);
        //     const storage = getStorage(app)
        //     const storageRef = ref(storage, imageDir + name);

        //     const metadata = {
        //         contentType: 'image/png',
        //     };


        //     await uploadBytes(storageRef, decodedImage, metadata)

        //     const results = await getDownloadURL(storageRef)

        //     res.json({ data: { image: name, url: results } })
    }

    getLink() {

        // return {image: data.publicURL, thumb: thumbData.publicURL}
    }
}

module.exports = Firebase