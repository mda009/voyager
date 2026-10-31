// Streamer.bot compiles a new Execute C# Code sub-action with only its default references. LINQ over a JArray/JObject
// (OfType, Cast, ...) then fails with CS0012 "ITypedList/IBindingList ... add a reference to System". These actions are
// meant to paste and compile with no extra references, so they must use index loops instead.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const FILES=['Voyager_Medals.cs','Voyager_Membership_Card.cs','Voyager_Dreadnought.cs'];
test('New Streamer.bot actions compile with Streamer.bot\'s default references (no LINQ over JSON arrays)',async()=>{
  for(const f of FILES){
    const src=await readFile(new URL('../'+f,import.meta.url),'utf8');
    for(const bad of ['.OfType<','.Cast<'])assert.ok(!src.includes(bad),f+' uses '+bad+' on JSON, which needs an extra System.dll reference in Streamer.bot');
  }
});
