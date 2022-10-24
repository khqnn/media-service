const StorageFactory = require('../storages/StorageFactory');
const axios = require('axios').default;


const imagesService = {}

imagesService.uploadImage = async (req, res) => {
    const base64image = req.body.base64

    const storageFactory = new StorageFactory()
    await storageFactory.compile(base64image)
    const storage = storageFactory.initiate('supabase')
    const results = await storage.upload()

    if (!results.success) {
        res.status(results.code).json(results)
        return
    }

    const links = storage.getLink()


    res.json({ success: true, data: { name: storageFactory.name, url: links } })

}


imagesService.getImage = async (req, res) => {
    const image = req.params.image

    const storageFactory = new StorageFactory()
    const storage = storageFactory.initiate('supabase')
    const results = await storage.download(image)

    if (!results.success) {
        res.status(results.code).json(results)
        return
    }

    const base64image = results.data
    const img = Buffer.from(base64image, 'base64');

    res.writeHead(200, {
        'Content-Type': 'image/webp',
        'Content-Length': img.length
    });
    res.end(img);

}

imagesService.getResizedImage = async (req, res) => {
    const image = req.params.image
    const dim = Number(req.params.dim)
    const imageName = dim + '_' + image

    const storageFactory = new StorageFactory()
    const storage = storageFactory.initiate('supabase')
    const results = await storage.download(imageName)
    let img = null

    if (!results.success) {

        const fullSizedImage = await storage.download(image)
        const base64image = fullSizedImage.data
        const storageFactory = new StorageFactory(imageName)
        await storageFactory.resize(base64image, dim)
        const lstorage = storageFactory.initiate('supabase')
        await lstorage.upload()

        img = storageFactory.image
    }
    else {

        const base64image = results.data
        img = Buffer.from(base64image, 'base64');
    }

    res.writeHead(200, {
        'Content-Type': 'image/webp',
        'Content-Length': img.length
    });
    res.end(img);

}


module.exports = imagesService