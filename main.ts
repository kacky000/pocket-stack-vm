// Tiny stack VM, ISA v1. node main.ts [in] [out]
import*as f from'fs'
let[,,I='/input',O='/output']=process.argv,P='01146:;?        999999959995999 999             04400           58              4414',
B=[]
// binary ops 0x10..0x22 ( a b -- r ); 0 = not a binary op
'a+b a-b Math.imul(a,b) a/b a%b (a>>>0)/(b>>>0) (a>>>0)%(b>>>0) 0 a&b a|b a^b 0 a<<b a>>b a>>>b 0 a==b a<b a>>>0<b>>>0'.split(' ').map((e,j)=>B[j+16]=Function('a,b','return '+e))
for(let d of f.readdirSync(I)){let g=I+`/${d}/`,p=f.readFileSync(g+'program.bin'),u=f.readFileSync(g+'input.bin'),n=p.length,D=new Int32Array(256),C=[],m=new Int32Array(256),t=Buffer.alloc(65536),s=0,c=0,i=0,z=0,l=0,o,k,w,q,a,b,x,e=(()=>{for(;;){
if(z++==1e6)return 10
if(c<0|c>=n)return 9
o=p[c];k=P.charCodeAt(o)-48;w=o==1?1:o==2?4:o>47&o<52?2:0
if(!(k>=0))return 5
if(c+w>=n)return 9
if(s<k>>2)return 2
if(s-(k>>2)+(k&3)>256)return 3
q=c+=1+w;b=D[s-1];a=D[s-2]
switch(o){case 0:return 0
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
case 49:case 50:s--;if(o&1?!b:b)c=q+p.readInt16LE(q-2);break
case 51:if(C.length>63)return 7;C.push(q);c=p.readUInt16LE(q-2);break
case 52:if(!C.length)return 8;c=C.pop();break
case 64:case 65:if(b<0|b>255)return 6;o&1?(m[b]=a,s-=2):D[s-1]=m[b];break
case 80:x=''+b;if(l+x.length>65536)return 11;l+=t.write(x,l,'latin1');s--;break
case 81:if(l>65535)return 11;t[l++]=b;s--;break
case 82:D[s++]=i<u.length?u[i++]:-1;break
case 83:return b&255
default:if(o>18&o<23&!b)return 4;D[s-2]=B[o](a,b);s--}}})()
g=O+`/${d}/`;f.mkdirSync(g,{recursive:true});f.writeFileSync(g+'stdout.bin',t.subarray(0,l));f.writeFileSync(g+'exit.txt',''+e)}
