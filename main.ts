// Tiny stack VM, ISA v1
import{readdirSync as L,readFileSync as F,writeFileSync as W,mkdirSync as M}from'fs'
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output'
// op -> 48+pops*4+pushes; ' ' = no such op
const P='01146:;?        999999959995999 999             04400           58              4414'
const B={16:(a,b)=>a+b,17:(a,b)=>a-b,18:Math.imul,19:(a,b)=>a/b,20:(a,b)=>a%b,21:(a,b)=>(a>>>0)/(b>>>0),22:(a,b)=>(a>>>0)%(b>>>0),24:(a,b)=>a&b,25:(a,b)=>a|b,26:(a,b)=>a^b,28:(a,b)=>a<<b,29:(a,b)=>a>>b,30:(a,b)=>a>>>b,32:(a,b)=>a==b,33:(a,b)=>a<b,34:(a,b)=>a>>>0<b>>>0}
function run(p,u){
const n=p.length,D=new Int32Array(256),C=[],m=new Int32Array(256),t=Buffer.alloc(65536)
let s=0,c=0,i=0,z=0,l=0,x
const E=e=>[t.subarray(0,l),e]
for(;;){
if(z==1e6)return E(10)
if(c<0||c>=n)return E(9)
const o=p[c],k=P.charCodeAt(o)-48,w=o==1?1:o==2?4:o>47&o<52?2:0
if(!(k>=0))return E(5)
if(c+w>=n)return E(9)
z++
if(s<k>>2)return E(2)
if(s-(k>>2)+(k&3)>256)return E(3)
const q=c+1+w,b=D[s-1],a=D[s-2]
c=q
switch(o){
case 0:return E(0)
case 1:D[s++]=p[q-1]<<24>>24;break
case 2:D[s++]=p.readInt32LE(q-4);break
case 3:s--;break
case 4:D[s++]=b;break
case 5:D[s-1]=a;D[s-2]=b;break
case 6:D[s++]=a;break
case 7:x=D[s-3];D[s-3]=a;D[s-2]=b;D[s-1]=x;break
case 23:D[s-1]=-b;break
case 27:D[s-1]=~b;break
case 48:c=q+p.readInt16LE(q-2);break
case 49:case 50:s--;if(o==49?!b:b)c=q+p.readInt16LE(q-2);break
case 51:if(C.length>63)return E(7);C.push(q);c=p.readUInt16LE(q-2);break
case 52:if(!C.length)return E(8);c=C.pop();break
case 64:if(b<0||b>255)return E(6);D[s-1]=m[b];break
case 65:if(b<0||b>255)return E(6);m[b]=a;s-=2;break
case 80:x=''+b;if(l+x.length>65536)return E(11);l+=t.write(x,l,'latin1');s--;break
case 81:if(l>65535)return E(11);t[l++]=b;s--;break
case 82:D[s++]=i<u.length?u[i++]:-1;break
case 83:return E(b&255)
default:if(o>18&&o<23&&!b)return E(4);D[s-2]=B[o](a,b);s--}}}
for(const d of L(I).sort()){
const f=I+'/'+d+'/',g=O+'/'+d+'/'
let u;try{u=F(f+'input.bin')}catch{u=[]}
const[r,e]=run(F(f+'program.bin'),u)
M(g,{recursive:true});W(g+'stdout.bin',r);W(g+'exit.txt',''+e)}
