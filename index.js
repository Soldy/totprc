'use strict';

const $crypto = require('crypto');


const totpBase = function(){
    this.get = function(key){
        return _get(key);
    }
    const _counterByte = function(){
        let now = Math.floor((Date.now() / 1000) / 30);
        let out = [];
        for(let i=0;8>i;i++) {
            out.push(now & (255));
            now = now >> 8;
        }
        out.reverse();
        return Buffer.from(out);
    }
    const _toBytes = function(hex) {
        let bytes = [];
        const length = parseInt(hex.length);
        for(let c=0; c<length; c += 2)
             bytes.push(
                 parseInt(
                    hex.substr(c, 2),
                    16
                )
            );
        return bytes;
    }
    const _get = function(key){
        const bytes = _toBytes(
            ($crypto.createHmac('sha1', Buffer.from(key))).
               update(_counterByte()).
               digest('hex')
            );
        const jump = bytes[19] & 0xf;
        const contex = (bytes[jump] & 0x7f) << 24 |
                        (bytes[jump + 1] & 0xff) << 16 |
                        (bytes[jump + 2] & 0xff) << 8  |
                        (bytes[jump + 3] & 0xff);
        return (contex % 1000000).toString().padStart(6, '0');
    }
}

exports.base = totpBase;



