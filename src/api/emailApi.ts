import {Spending} from '../entities/spending'

export type EmailApi = (userId: string, subject: string, body: string) => Spending[]
