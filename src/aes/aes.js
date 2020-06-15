/**
 * aes加解密
 * Created at 2020/5/22 11:01
 *
 * @author DaiHai
 * @version 1.0
 */
import CryptoJS from 'crypto-js'


export function getRandom(long) {
    let arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
        num = "";
    for (let i = 0; i < long; i++) {
        num += arr[parseInt(Math.random() * 62)];
    }
    return num;
}

/**
 * aes 加密
 * @param word 加密体
 * @param key 秘钥
 * @param iv 偏移量
 * @returns {string}
 */
export function encrypt(word, key, iv) {
    key = CryptoJS.enc.Utf8.parse(key);
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: CryptoJS.enc.Utf8.parse(iv), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
}

/**
 * aes 解密
 * @param word 解密体
 * @param keyStr 秘钥
 * @param iv 偏移量
 * @returns {string}
 */
export function decrypt(word, keyStr, iv) {
    let key = CryptoJS.enc.Utf8.parse(keyStr);
    let base64 = CryptoJS.enc.Base64.parse(word);
    let src = CryptoJS.enc.Base64.stringify(base64)
    let decrypt = CryptoJS.AES.decrypt(src, key, { iv: CryptoJS.enc.Utf8.parse(iv), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = CryptoJS.enc.Utf8.stringify(decrypt).toString()

    return decryptedStr.toString();
}


export default {
    decrypt,
    encrypt,
    getRandom
}

