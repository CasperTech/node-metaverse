import type { PhysicsShapeType } from '../enums/PhysicsShapeType';

export class ObjectPhysicsDataEvent
{
    public localID: number;

    public density: number;
    public friction: number;
    public gravityMultiplier: number;
    public physicsShapeType: PhysicsShapeType;
    public restitution: number;
}
