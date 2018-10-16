"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const __1 = require("..");
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
        const realRegionX = Math.floor(regionX / 256) * 256;
        const realRegionY = Math.floor(regionY / 256) * 256;
        const localX = regionX - realRegionX;
        const localY = regionY - realRegionY;
        const handle = new Long(realRegionY, realRegionX);
        return {
            'regionHandle': handle,
            'regionX': realRegionX / 256,
            'regionY': realRegionY / 256,
            'localX': localX,
            'localY': localY
        };
    }
    static HTTPAssetTypeToInventoryType(HTTPAssetType) {
        switch (HTTPAssetType) {
            case __1.HTTPAssets.ASSET_TEXTURE:
                return 'texture';
            case __1.HTTPAssets.ASSET_SOUND:
                return 'sound';
            case __1.HTTPAssets.ASSET_ANIMATION:
                return 'animation';
            case __1.HTTPAssets.ASSET_GESTURE:
                return 'gesture';
            case __1.HTTPAssets.ASSET_LANDMARK:
                return 'landmark';
            case __1.HTTPAssets.ASSET_CALLINGCARD:
                return 'callcard';
            case __1.HTTPAssets.ASSET_SCRIPT:
                return 'script';
            case __1.HTTPAssets.ASSET_CLOTHING:
                return 'wearable';
            case __1.HTTPAssets.ASSET_OBJECT:
                return 'object';
            case __1.HTTPAssets.ASSET_NOTECARD:
                return 'notecard';
            case __1.HTTPAssets.ASSET_CATEGORY:
                return 'category';
            case __1.HTTPAssets.ASSET_LSL_TEXT:
                return 'script';
            case __1.HTTPAssets.ASSET_LSL_BYTECODE:
                return 'script';
            case __1.HTTPAssets.ASSET_BODYPART:
                return 'wearable';
            case __1.HTTPAssets.ASSET_MESH:
                return 'mesh';
            default:
                return '';
        }
    }
    static ByteToFloat(byte, lower, upper) {
        const ONE_OVER_BYTEMAX = 1.0 / 255;
        let fval = byte * ONE_OVER_BYTEMAX;
        const delta = (upper - lower);
        fval *= delta;
        fval += lower;
        const error = delta * ONE_OVER_BYTEMAX;
        if (Math.abs(fval) < error) {
            fval = 0.0;
        }
        return fval;
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
    static HexToLong(hex) {
        while (hex.length < 16) {
            hex = '0' + hex;
        }
        return new Long(parseInt(hex.substr(8), 16), parseInt(hex.substr(0, 8), 16));
    }
    static ReadRotationFloat(buf, pos) {
        return ((buf[pos] | (buf[pos + 1] << 8)) / 32768.0) * (2 * Math.PI);
    }
    static ReadGlowFloat(buf, pos) {
        return buf[pos] / 255;
    }
    static ReadOffsetFloat(buf, pos) {
        const offset = buf.readInt16LE(pos);
        return offset / 32767.0;
    }
}
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map