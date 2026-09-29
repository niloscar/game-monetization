/**
 * Admin ad routes
 */

import { Router } from "express"
import { createAd, updateAd, deleteAd, getAdminAds, getAdminAd } from "../../controllers/ad"

const adminAdRouter = Router()

adminAdRouter.get('/', getAdminAds)
adminAdRouter.get('/:id', getAdminAd)
adminAdRouter.post('/', createAd)
adminAdRouter.patch('/:id', updateAd)
adminAdRouter.delete('/:id', deleteAd)

export default adminAdRouter