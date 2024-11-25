import * as fs from 'fs';
import { LLMesh } from '../classes/public/LLMesh';
const fileName = '/home/tom/projects/node-libnmv/assets/ce167705-00a3-4664-8c6c-a58edf9f0001_mesh.llmesh';

const buf = fs.readFileSync(fileName);
LLMesh.from(buf).then((mesh: LLMesh) =>
{
    console.log(mesh);
});

