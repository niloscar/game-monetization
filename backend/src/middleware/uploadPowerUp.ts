import multer from 'multer'
const storage = multer.memoryStorage()
const uploadPowerUp = multer({ storage })
export default uploadPowerUp



