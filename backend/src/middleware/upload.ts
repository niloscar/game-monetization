import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, '../frontend/public/mock/ads')
    },
    filename: function (_req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage })

export default upload
