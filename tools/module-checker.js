(async ()=>{
  try{
    require('ts-node/register');
    require('../app/_layout.tsx');
    console.log('Imported app/_layout.tsx successfully');
  } catch(e){
    console.error('Import error:', e);
    process.exit(1);
  }
})();
