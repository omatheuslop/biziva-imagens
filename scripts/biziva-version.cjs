const fs=require('node:fs');
const crypto=require('node:crypto');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'dist/bundle.js'))).digest('hex').slice(0,16);
const index=path.join(root,'index.html');
const source=fs.readFileSync(index,'utf8');
fs.writeFileSync(index,source.replace(/src="dist\/bundle\.js(?:\?[^\"]*)?"/,'src="dist/bundle.js?v=biziva-'+hash+'"').replace(/<title>[^<]*<\/title>/,'<title>Biziva Imagens | Editor baseado no miniPaint</title>'));
