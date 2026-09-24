/**
 * Admin ad routes
 */

import { Router } from "express"
import { getAd, getAds, createAd, updateAd, deleteAd } from "../../controllers/ad"

const adminAdRouter = Router()

adminAdRouter.get('/', getAds)
adminAdRouter.get('/:id', getAd)
adminAdRouter.post('/', createAd)
adminAdRouter.patch('/:id', updateAd)
adminAdRouter.delete('/:id', deleteAd)

export default adminAdRouter