
const express = require( 'express');
const router = express.Router();
const imagesService = require( '../services/images');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json( { title: 'Express' });
});


router.post('/media/images', imagesService.uploadImage)

router.get('/media/images/:image', imagesService.getImage)

router.get('/media/images/:dim/:image', imagesService.getResizedImage)


module.exports = router
