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
        console.log("Creating circuit");
        this.circuit = new Circuit();
    }
}
