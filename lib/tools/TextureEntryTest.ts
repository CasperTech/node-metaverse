import { TextureEntry } from '../classes/TextureEntry';

const n = Buffer.from('CAD82CAD56668BF13CAC8CDAB40DD20C000000000000000000400000000040000000000000000000000000000000006FB900FB728A247A72B75BC55CD5257A00', 'hex');
const entry = TextureEntry.from(n);
console.log(JSON.stringify(entry, null, 4));
