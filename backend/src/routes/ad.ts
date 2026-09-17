/**
 * Ad routes
 */

import { Router } from 'express'
import { getAds, getAd, createAd, updateAd, deleteAd } from '../controllers/ad'

const adRoutes = Router()

adRoutes.get('/', getAds)
adRoutes.get('/:id', getAd)
adRoutes.post('/', createAd)
adRoutes.patch('/:id', updateAd)
adRoutes.delete('/:id', deleteAd)

export default adRoutes