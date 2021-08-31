// 引入 crypto 模块
const crypto = require("crypto");

// 指定加密工作模式
const algorithm = "AES-128-CBC";

// 加密密钥（key）
const key = Buffer.from("e43ee68382dc550fbd1d329486febdd4", "hex");

// 初始向量（iv）
const iv = Buffer.from("ddffc44a93503156abb36e9bbca876f8", "hex");

// 待加密明文
const pText = "AES 算法基于 Java 实战演示";

// 初始化加密函数
const cipher = crypto.createCipheriv(algorithm, key, iv);

// 加密 toHex
let cText = cipher.update(pText, "utf-8", "hex");
cText += cipher.final("hex");

// 初始化解密函数
const decipher = crypto.createDecipheriv(algorithm, key, iv);

let dText = decipher.update(cText, "hex", "utf-8");
dText += decipher.final("utf8");

console.log("key：" + key.toString("hex"));
console.log("iv：" + iv.toString("hex"));
console.log("明文：" + pText);
console.log("加密后数据：" + cText);
console.log("解密密后数据： " + dText);
