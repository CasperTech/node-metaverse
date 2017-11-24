import {Circuit} from './Circuit';

export class Region
{
    xCoordinate: number;
    yCoordinate: number;
    port: number;
    ipAddress: string;
    circuit: Circuit;

    constructor()
    {
        this.circuit = new Circuit();
    }
}
