// Test reporter for GitHub Actions: turns each failing test into an error annotation,
// so the failure is readable on the run's summary page without opening the full log.
const esc=s=>String(s).replace(/%/g,'%25').replace(/\r/g,'%0D').replace(/\n/g,'%0A');
export default async function* githubReporter(source){
  for await(const event of source){
    if(event.type!=='test:fail')continue;
    const d=event.data,err=d.details?.error,cause=err?.cause??err;
    if(d.details?.type==='suite')continue;
    const message=[cause?.message||String(cause||'Test failed'),cause?.expected!==undefined?'expected: '+JSON.stringify(cause.expected):'',cause?.actual!==undefined?'actual: '+JSON.stringify(cause.actual):''].filter(Boolean).join('\n').slice(0,3000);
    const file=d.file?d.file.replace(process.cwd(),'').replace(/^[\\/]+/,'').replace(/\\/g,'/'):'';
    yield `::error ${file?`file=${esc(file)},`:''}title=${esc(d.name).replace(/,/g,'%2C').replace(/::/g,':')}::${esc(message)}\n`;
  }
}
