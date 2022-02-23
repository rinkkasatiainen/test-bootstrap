import { Planet, Location } from '../interfaces'

export class Mars implements Planet {
    public readonly obstacles: Location[] = []

    public addObstacle(location: Location): void {
        this.obstacles.push(location)
    }
}
