// Tiny stack VM, ISA v1
import{readdirSync as L,readFileSync as F,writeFileSync as W,mkdirSync as M}from'fs'
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output'
// op:[imm,pops,pushes]
const K={0:'000',1:'101',2:'401',3:'010',4:'012',5:'022',6:'023',7:'033',23:'011',27:'011',48:'200',49:'210',50:'210',51:'200',52:'000',64:'011',65:'020',80:'010',81:'010',82:'001',83:'010'}
const B={16:(a,b)=>a+b,17:(a,b)=>a-b,18:Math.imul,19:(a,b)=>a/b,20:(a,b)=>a%b,21:(a,b)=>(a>>>0)/(b>>>0),22:(a,b)=>(a>>>0)%(b>>>0),24:(a,b)=>a&b,25:(a,b)=>a|b,26:(a,b)=>a^b,28:(a,b)=>a<<b,29:(a,b)=>a>>b,30:(a,b)=>a>>>b,32:(a,b)=>a==b,33:(a,b)=>a<b,34:(a,b)=>a>>>0<b>>>0}
for(const o in B)K[o]='021'
for(const o in K)K[o]=[...K[o]].map(Number)
function run(p,u){
const n=p.length,D=new Int32Array(256),C=[],m=new Int32Array(256),t=Buffer.alloc(65536)
let s=0,c=0,i=0,z=0,l=0,x
const E=e=>[t.subarray(0,l),e]
for(;;){
if(z==1e6)return E(10)
if(c<0||c>=n)return E(9)
const o=p[c],k=K[o]
if(!k)return E(5)
if(c+k[0]>=n)return E(9)
z++
if(s<k[1])return E(2)
if(s-k[1]+k[2]>256)return E(3)
const q=c+1+k[0],b=D[s-1],a=D[s-2]
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
