/**
 * Admin ad routes
 */

import { Router } from "express"
import { createAd, updateAd, deleteAd, getAdminAds, getAdminAd } from "../../controllers/ad"
import upload from "../../middleware/upload"

const adminAdRouter = Router()

adminAdRouter.get('/', getAdminAds)
adminAdRouter.get('/:id', getAdminAd)
adminAdRouter.post('/', upload.single('media'), createAd)
adminAdRouter.patch('/:id', updateAd)
adminAdRouter.delete('/:id', deleteAd)

export default adminAdRouter