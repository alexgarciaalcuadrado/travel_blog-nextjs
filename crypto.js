import CryptoJS from "crypto-js";

const key = CryptoJS.enc.Utf8.parse('b75524255a7f54d2726a951bb39204df');
const iv  = CryptoJS.enc.Utf8.parse('1583288699248111');
const encryptPassword = (password) => {
    const encryptedCP = CryptoJS.AES.encrypt(password, key, { iv: iv });
    const cryptText = encryptedCP.toString();
    return cryptText;
}

const decryptPassword = (hash) => {
    const decryptedWA = CryptoJS.AES.decrypt(hash, key, { iv: iv});
    const passwordText = decryptedWA.toString(CryptoJS.enc.Utf8);
    return passwordText;
}

export {encryptPassword, decryptPassword} 