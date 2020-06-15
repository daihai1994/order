/**
 * Created at 2020/5/19 11:24
 *
 * @author DaiHai
 * @version 1.0
*/
const errorCode = {
        // 请求成功
         SUCCESS: 1001,
        // 客户端持有的服务端RSA公钥过期（更新的服务端公钥并重新请求）
        KEY_RSA_SERVER_EXPIRED: 1002,
        // 服务端持有的客户端RSA公钥过期（重新登录，交换新的RSA公钥）
        KEY_RSA_CLIENT_EXPIRED: 1003,
        // RSA解密AES密钥失败
        DECRYPT_AES_KEY_FAILED: 1004,
        // AES解密请求体失败
        DECRYPT_REQUEST_BODY_FAILED: 1005,
        // AES解密返回体失败
        DECRYPT_RESPONSE_BODY_FAILED: 1015,
        // 请求体Hash值验证失败
        VERIFY_HASH_VALUE_FAILED: 1006,
        // 服务端错误
        SERVER_ERROR: 1007,
        // 服务端Aes密钥使用客户端RSA公钥加密失败
        ENCRYPT_AES_KEY_FAILED: 1008,
        // 获取请求体错误
        GET_REQUEST_BODY_FAILED: 1009,
        // 未知错误
        UNKNOWN_ERROR: 2001,
        // 请求失败
        FAIL: 1010,
        // 用户已存在（注册用户）
        USER_ALREADY_EXITS: 1012,
        // 服务端加密用户密码失败（注册用户）
        ENCRYPT_PASSWORD_FAILED: 1013,
        // 用户名或密码错误（登录、更新用户信息）
        USER_DOES_NOT_EXITS: 1014,
        // 该手机号已被使用（修改手机号）
        PHONE_NUMBER_OCCUPIED: 1016,
        // 该手机号没有注册（根据短信验证码找回密码）
        PHONE_NUMBER_IS_NOT_REGISTERED: 1017,
        // 旧密码错误（修改密码）
        ORIGINAL_PASSWORD_WRONG: 1018,
        // 该邮箱已被使用（修改邮箱）
        MAIL_OCCUPIED: 1019,
        // 人脸特征值数量超标（上传人脸特征值）
        OVER_FACE_NUM: 1023,
}
const rsaAes = {
        iv: "1234567890987654",//AES偏移量
        key: "IZnqNJqgLwPLO9LxMP23xZNmHHq55AmB", //AES秘钥
        vuePrivateKey: "-----BEGIN PRIVATE KEY-----MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAI22AkS1ORdXHDttCUIPhdvRRmLgo2plXbwxAaEfQEedCo7ZzOZ70sfBnPjypjDfUa738OOvjJYjkQglkJApy7ftK9aE1nSOPbylPY+1ZWFzgy3NGT82pwTIGUI0UD3suL+rc77uGilO9o5k07IzWp7Fskktj02HCu7ANd0wyFNDAgMBAAECgYEAgjN2RhaTi+RXZio6VV3ZySuwlex7eKgFxYDpVFZYQvQA3VszrZibAznatciL9V9Zt37K7wc+DjxDZs7M0gf0yXpymNj7uXf+ZYvubOAloJK0DsdZq/wUgJmG5WhbbEwPOP/laOlsP7SQ9GAkpt72CwPSUkBobutJxWmjmC+7A6ECQQDVeBmio8XXpL2yBEfLcGilEUMn/1qN9tXBl6B6hSDPibm1KqX5K8+HA83Lq02P+3PpmWTA98eimwPSS95KqBSZAkEAqfHqMHuTqpm4ec0K77hGPeza8UCM+hxmB/8deSIN3syWhoDW+nhXWIFK8ADMftsf1Pl7W6JMl32UPDbFJBC0OwJAcIE3oYwG/TwJ7gRrgkDgJf8PEcl3BFMPHVS4c1oujLLdeSndB5GbcmEC2VCTNEsmL/t0Km9se7qPLQpnQZmMIQI/Go2yCeFFMWLTcDSZgNtKHmLj0s5DONE3IAi8kjC/+g/9dQaskHY9L5cEHnwBd9DFKIHSxH6XeRQmFUJ5iykRAkAQPyw9kFQbek6IQvJOT3w5bnrn+Ug+loQfLqQLoAbMWJmsD75VXYV1b2GQR9r7HWWw5rxECXERDhGHSoAkBJc7-----END PRIVATE KEY-----",
        vuePublicKey: "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCNtgJEtTkXVxw7bQlCD4Xb0UZi4KNqZV28MQGhH0BHnQqO2czme9LHwZz48qYw31Gu9/Djr4yWI5EIJZCQKcu37SvWhNZ0jj28pT2PtWVhc4MtzRk/NqcEyBlCNFA97Li/q3O+7hopTvaOZNOyM1qexbJJLY9NhwruwDXdMMhTQwIDAQAB",
        serverPublicKey: ""//服务端公钥
}

export default {
        errorCode,
        rsaAes
}