import fs from 'fs';

async function download(url, dest) {
  console.log(`Downloading ${url} to ${dest}...`);
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(arrayBuffer));
}

async function main() {
  try {
    // A cool modern glass skyscraper
    await download('https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1024&q=80', 'public/building_1.jpg');
    // Corporate lit windows
    await download('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1024&q=80', 'public/building_2.jpg');
    // Cyberpunk/Dark skyscraper with cool lights
    await download('https://images.unsplash.com/photo-1573033501659-dc6d926316ef?w=1024&q=80', 'public/building_3.jpg');
    // Beautiful deep galaxy
    await download('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=2048&q=80', 'public/galaxy.jpg');
    console.log('Downloaded all textures successfully.');
  } catch (e) {
    console.error(e);
  }
}
main();
