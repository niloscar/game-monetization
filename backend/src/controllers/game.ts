/**
 * Game controller
 */

import type { Request, Response } from 'express'


/*------------------------------------------------------------------------------
 * Scores
 *------------------------------------------------------------------------------*/
export const getScores = (_req: Request, res: Response<{ message: string }>) => {
    res.json({ message: 'Scores-route' })
}

export const getScore = (req: Request<{ scoreId: string }>, res: Response<{ message: string }>) => {
    const { scoreId } = req.params
    res.json({ message: `Score-route for scoreId: ${scoreId}` })
}

export const createScore = (req: Request, res: Response<{ message: string }>) => {
    res.json({ message: 'Create-score route' })
}

export const deleteScore = (req: Request<{ scoreId: string }>, res: Response<{ message: string }>) => {
    const { scoreId } = req.params
    res.json({ message: `Delete-score route for scoreId: ${scoreId}` })
}

// ONTODO: Implement the getScoresByUserId function to retrieve scores for a specific user by their userId.
// export const getScoresByUserId(req: Request<{ userId: string }>, res: Response<{ message: string }>) => {
//     const { userId } = req.params
//     res.json({ message: `Scores-by-userId route for userId: ${userId}` })
// }