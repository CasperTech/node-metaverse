import {Circuit} from './Circuit';

export class Region
{
    xCoordinate: number;
    yCoordinate: number;
    circuit: Circuit;

    constructor()
    {
        this.circuit = new Circuit();
    }
}
