const http = require('http');
const fs = require('fs');

async function probe(port){
  return new Promise((resolve)=>{
    const req = http.get({host:'localhost', port, path:'/', timeout:2000}, (res)=>{
      let data='';
      res.on('data',c=>data+=c);
      res.on('end',()=>resolve({port, status: res.statusCode, body: data}));
    });
    req.on('error',()=>resolve(null));
    req.on('timeout',()=>{ req.destroy(); resolve(null); });
  });
}

(async ()=>{
  for(let p of [19006,19000,19001,19002,19003,19004,19005,19007,19008,19009,19010]){
    // eslint-disable-next-line no-await-in-loop
    const r = await probe(p);
    if(r && r.status===200){
      console.log('found', p);
      fs.writeFileSync('expo_root_'+p+'.html', r.body);
      process.exit(0);
    }
  }
  console.log('not found');
  process.exit(1);
})();
