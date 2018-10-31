import {PhysicsShapeType} from '../enums/PhysicsShapeType';

export class ObjectPhysicsDataEvent
{
    localID: number;

    density: number;
    friction: number;
    gravityMultiplier: number;
    physicsShapeType: PhysicsShapeType;
    restitution: number;
}
