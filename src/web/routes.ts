import {Application, Router, Request, Response, NextFunction} from 'express'
import {Repository} from '../server'

export const routes: (a: Router) => (b: Repository) => (c: Application) => Router =
    router => repository => app => {

        router.get('/', (req: Request, res: Response, next: NextFunction) => {
            res.json({status: 'ok'})
        })

        router.get('/status/:status', (req: Request, res: Response, next: NextFunction) => {
            const status = req.params.status
            res.json({status})
        })
        return router
    }
