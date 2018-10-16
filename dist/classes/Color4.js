"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Color4 {
    constructor(red, green, blue, alpha = 0) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
        if (red instanceof Buffer && typeof blue === 'boolean') {
            const buf = red;
            const pos = green;
            const inverted = blue;
            let alphaInverted = false;
            if (typeof alpha === 'boolean' && alpha === true) {
                alphaInverted = true;
            }
            this.red = 0.0;
            this.green = 0.0;
            this.blue = 0.0;
            this.alpha = 0.0;
            const quanta = 1.0 / 255.0;
            if (inverted) {
                this.red = (255 - buf[pos]) * quanta;
                this.green = (255 - buf[pos + 1]) * quanta;
                this.blue = (255 - buf[pos + 2]) * quanta;
                this.alpha = (255 - buf[pos + 3]) * quanta;
            }
            else {
                this.red = buf[pos] * quanta;
                this.green = buf[pos + 1] * quanta;
                this.blue = buf[pos + 2] * quanta;
                this.alpha = buf[pos + 3] * quanta;
            }
            if (alphaInverted) {
                this.alpha = 1.0 - this.alpha;
            }
        }
    }
}
Color4.black = new Color4(0.0, 0.0, 0.0, 1.0);
Color4.white = new Color4(1.0, 1.0, 1.0, 1.0);
exports.Color4 = Color4;
//# sourceMappingURL=Color4.js.map