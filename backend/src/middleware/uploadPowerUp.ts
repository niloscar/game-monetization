import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, '../frontend/public/mock/powerups')
    },
    filename: function (_req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploadPowerUp = multer({ storage })

export default uploadPowerUp
