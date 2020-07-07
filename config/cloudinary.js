const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'walkr-app',
  allowedFormats: ['jpg', 'png'],
  transformation: [
    {width: 400, height: 400, gravity: "face", radius: "max", crop: "crop"},
    {width: 200}
  ],
  filename: function (req, res, cb) {
    cb(null, res.originalname);
  }
})

const uploader = multer({ storage });

module.exports = {
  uploader,
  cloudinary
};
