/**
 * Ad routes
 */

import { Router } from 'express'
import { getAds, getAd} from '../controllers/ad'

const adRouter = Router()

adRouter.get('/', getAds)
adRouter.get('/:id', getAd)

export default adRouter