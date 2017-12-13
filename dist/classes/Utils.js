"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const HTTPAssets_1 = require("../enums/HTTPAssets");
class Utils {
    static StringToBuffer(str) {
        return Buffer.from(str + '\0', 'utf8');
    }
    static BufferToStringSimple(buf, startPos) {
        if (buf.length === 0) {
            return '';
        }
        if (buf[buf.length - 1] === 0) {
            return buf.slice(0, buf.length - 1).toString('utf8');
        }
        else {
            return buf.toString('utf8');
        }
    }
    static BufferToString(buf, startPos) {
        if (buf.length === 0) {
            return {
                readLength: 0,
                result: ''
            };
        }
        if (startPos === undefined) {
            startPos = 0;
        }
        let foundNull = -1;
        for (let x = startPos; x <= buf.length; x++) {
            if (buf[x] === 0) {
                foundNull = x;
                break;
            }
        }
        if (foundNull === -1) {
            console.error('BufferToString: Null terminator not found after ' + (buf.length - startPos) + ' bytes. Buffer length: ' + buf.length + ', startPos: ' + startPos);
            foundNull = buf.length - 1;
        }
        return {
            readLength: (foundNull - startPos) + 1,
            result: buf.slice(startPos, foundNull).toString('utf8')
        };
    }
    static RegionCoordinatesToHandle(regionX, regionY) {
        regionX = Math.floor(regionX / 256) * 256;
        regionY = Math.floor(regionY / 256) * 256;
        return new Long(regionY, regionX);
    }
    static HTTPAssetTypeToInventoryType(HTTPAssetType) {
        switch (HTTPAssetType) {
            case HTTPAssets_1.HTTPAssets.ASSET_TEXTURE:
                return 'texture';
            case HTTPAssets_1.HTTPAssets.ASSET_SOUND:
                return 'sound';
            case HTTPAssets_1.HTTPAssets.ASSET_ANIMATION:
                return 'animation';
            case HTTPAssets_1.HTTPAssets.ASSET_GESTURE:
                return 'gesture';
            case HTTPAssets_1.HTTPAssets.ASSET_LANDMARK:
                return 'landmark';
            case HTTPAssets_1.HTTPAssets.ASSET_CALLINGCARD:
                return 'callcard';
            case HTTPAssets_1.HTTPAssets.ASSET_SCRIPT:
                return 'script';
            case HTTPAssets_1.HTTPAssets.ASSET_CLOTHING:
                return 'wearable';
            case HTTPAssets_1.HTTPAssets.ASSET_OBJECT:
                return 'object';
            case HTTPAssets_1.HTTPAssets.ASSET_NOTECARD:
                return 'notecard';
            case HTTPAssets_1.HTTPAssets.ASSET_CATEGORY:
                return 'category';
            case HTTPAssets_1.HTTPAssets.ASSET_LSL_TEXT:
                return 'script';
            case HTTPAssets_1.HTTPAssets.ASSET_LSL_BYTECODE:
                return 'script';
            case HTTPAssets_1.HTTPAssets.ASSET_BODYPART:
                return 'wearable';
            case HTTPAssets_1.HTTPAssets.ASSET_MESH:
                return 'mesh';
            default:
                return '';
        }
    }
    static UInt16ToFloat(val, lower, upper) {
        const ONE_OVER_U16_MAX = 1.0 / 65535;
        let fval = val * ONE_OVER_U16_MAX;
        const delta = upper - lower;
        fval *= delta;
        fval += lower;
        const maxError = delta * ONE_OVER_U16_MAX;
        if (Math.abs(fval) < maxError) {
            fval = 0.0;
        }
        return fval;
    }
    static Base64EncodeString(str) {
        const buff = new Buffer(str, 'utf8');
        return buff.toString('base64');
    }
    static Base64DecodeString(str) {
        const buff = new Buffer(str, 'base64');
        return buff.toString('utf8');
    }
}
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map