"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typed_event_emitter_1 = require("typed-event-emitter");
class PacketEventEmitter extends typed_event_emitter_1.EventEmitter {
    constructor(value) {
        super();
        this.onValueChanged = this.registerEvent();
        this._value = value;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.emit(this.onValueChanged, this._value);
    }
}
let instance = new MyClass();
instance.onValueChanged(newValue => {
    console.log(`Value changed: ${newValue}`);
});
instance.value = 27;
//# sourceMappingURL=PacketEventEmitter.js.map