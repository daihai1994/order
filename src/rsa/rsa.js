/**
 * rsa加解密
 * Created at 2020/5/22 13:09
 *
 * @author DaiHai
 * @version 1.0
 */

import JsEncrypt from 'jsencrypt'
import JsRsaSign from 'jsrsasign'
/**
 * rsa 加密
 * @param pas 加密体
 * @param publicKey rsa
 * @returns {CipherParams|string|null|PromiseLike<ArrayBuffer>}
 */
export function rsaEncrypt  (pas, publicKey) {
    let jse =JsEncrypt;
    jse.prototype.setPublicKey(publicKey)
    let encrypted = jse.prototype.encrypt(pas)
    return encrypted;
}

/**
 * rsa 解密
 * @param pas 解密体
 * @param privateKey rsa私钥
 * @returns {WordArray|string|null|PromiseLike<ArrayBuffer>}
 */
export function rsaDecrypt (pas, privateKey) {
    let jse = JsEncrypt
    // 私钥
    // console.log('解密：'+privateKey)
    jse.prototype.setPrivateKey(privateKey)
    // console.log('解密：'+jse.decrypt(pas))
    let prototype = jse.prototype.decrypt(pas);
    return prototype;
}



/**
 *  rsa签名
 * @param signData 签名体
 * @param privateKey rsa私钥
 * @returns {*}
 */
export function getSign(signData, privateKey) {
    let rsa = JsRsaSign.RSAKey()
    rsa = JsRsaSign.KEYUTIL.getKey("-----BEGIN PRIVATE KEY-----" + privateKey + "-----END PRIVATE KEY-----")
    let sig = new JsRsaSign.KJUR.crypto.Signature({ "alg": "MD5withRSA" })
    sig.init(rsa)
    sig.updateString(signData)
    return JsRsaSign.hextob64(sig.sign())
    // return sig.sign()
}

export default {
    rsaEncrypt,
    rsaDecrypt,
    getSign
}