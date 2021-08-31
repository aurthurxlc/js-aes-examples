本篇将对 AES 算法在浏览器端的 JavaScript 语言中应用做实战讲解，为什么要强调是浏览器端？因为后面还会对 Node 环境下 AES 算法应用单独做个实战演示，如果你是在 Node 环境中使用的，请移步。

因为 JavaScript 标准库对 AES 算法支持有限，这里会第三方库 https://github.com/brix/crypto-js 做讲解（后面简称 CryptoJS），也推荐在正式环境中使用。由于篇幅限制，所有的演示代码将只展示关键步骤。

首先要在你的页面里引入 CryptoJS ：

```html
<!-- 请替换成你下载的 CryptoJS 路径 -->
<script
  type="text/javascript"
  src="path-to/bower_components/crypto-js/crypto-js.js"
></script>
```

CryptoJS AES 算法使用的接口非常简单，就如下两个加密/解密两个方法：

```javascript
// plainData 表示待加密数据
let encrypted = CryptoJS.AES.encrypt(plainData);

// cryptoData 表示待解密数据
let decrypted = CryptoJS.AES.decrypt(cryptoData);
```

咦？怎么没有我们之前叨叨了半天的密钥（key）、初始向量（iv）、工作模式（M） 、数据填充模式（P）？难道它不支持？

当然不是，这么优秀的库肯定是支持的，只不过它为了极大降低新手的入手难度，很多参数都是默认内置了，具体看下面详解。

**密钥（key）**

其实 CryptoJS.AES.encrypt 和 CryptoJS.AES.decrypt 两个函数都可以接受第二个参数作为密钥，如果第二个参数为空，它会自己生成一个随机 256 位长度 的 key 进行加解密。当然现实中没有人会不传密钥给加密函数，否则你怎么解密呢？

CryptoJS 支持 AES 标准算法 AES-128、AES-192 及 AES-256 三种，具体采用哪种算法就看你的 key 的长度是多少。

实战演示：

```javascript
let key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");

let encrypted = CryptoJS.AES.encrypt(plainData, key);

let decrypted = CryptoJS.AES.decrypt(cryptoDatam key);
```

**初始向量（iv）**

初始向量可以在第三个参数进行传入，使用演示：

```javascript
let iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");

let encrypted = CryptoJS.AES.encrypt(plainData, key, { iv: iv });
```

注意，标准 AES 算法的 iv 是 128 位的，所以这里给了一个 32 个字符的 2 进制字符串作为演示。不懂为什么是 128 位？可以去看看前面的基础部分《AES 算法（四）基本工作模式》。

**工作模式（M）**

工作模式也可以在第三个参数进行指定，CryptoJS 支持的工作模式有：CBC、CFB、CTR、OFB、ECB，不指定的话默认使用 CBC 模式。

使用演示：

```javascript
let encrypted = CryptoJS.AES.encrypt(plainData, key, {
  mode: CryptoJS.mode.CBC,
});
```

**数据填充模式（P）**

数据填充模式也可以在第三个参数进行指定，CryptoJS 支持的填充模式有：Pkcs7、Iso97971、AnsiX923、Iso10126、ZeroPadding、NoPadding，不指定的话默认使用 Pkcs7 模式。

使用演示：

```javascript
let encrypted = CryptoJS.AES.encrypt(plainData, key, {
  padding: CryptoJS.pad.Pkcs7,
});
```

咦？这里怎么不支持 Java 标准中的 PKCS5？请注意 PKCS5 是 PKCS7 的子集，不要再纠结了，Java 使用的 PKCS5 也就是在使用 PKCS7。还在纠结的话请移步前面的基础部分《AES 算法（三）填充模式》。

**综合实战**

基本使用在上面已经讲解完毕了，但是为防止还是有同学不知道如何上手，我们来全面的实战演示一下。

现实中常见的加密需求一定是要和后端同学联动的，这里就以之前的 Java 实战篇所使用的参数相同为基础，来看看我们是否能得到相同的加密字符串，并且同样也能解密出来。

核心代码如下，如果想自己运行看看并且调试一下，请移步 https://github.com/aurthurxlc/js-aes-examples

```javascript
let key = CryptoJS.enc.Hex.parse("e43ee68382dc550fbd1d329486febdd4");
let iv = CryptoJS.enc.Hex.parse("ddffc44a93503156abb36e9bbca876f8");
let pText = "AES 算法基于 Java 实战演示";

let encrypted = CryptoJS.AES.encrypt(pText, key, {
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
});

console.log(encrypted.ciphertext.toString()); // toHex

let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
});

console.log(CryptoJS.enc.Utf8.stringify(decrypted)); // 转为 String
```

在 console 控制台查看结果，可以看跟 Java 的输出结果是一模一样的：

```javascript
e8aa678c21aa028988cd74ee2835344519014a4e9365cb8dda7cf24bfe95dfdf0e047cf979587b02500ccad15415b1c3

AES 算法基于 Java 实战演示
```
