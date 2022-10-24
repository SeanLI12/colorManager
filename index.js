

import { simpleGit } from 'simple-git';
import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import Color from 'easy-color';
import rgba from 'color-rgba';
  
// File path
const file = "./colormanger/clonefiles/188_light.json";
const file_dark = "./colormanger/clonefiles/188_dark.json";


const USER = 'SeanLI12';
const PASS = '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';
const REPO = 'github.com/SeanLI12/colorjson.git';



const remote = `https://${ USER }:${ PASS }@${ REPO }`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3003;
app.use(express.json());







simpleGit()
  .clone(remote,"./colormanger/clonefiles")
  .then(
    () => {
      fs.copyFile(file, "./colormanger/temp/188_light.json", (err) => {
        if (err) {
          console.log("Error Found:", err);
        }
        else {
       
          fs.copyFile(file_dark, "./colormanger/temp/188_dark.json", (err) => {
            if (err) {
              console.log("Error Found:", err);
            }
            else {
              fs.removeSync("./colormanger/clonefiles"); 
              
            }
          });
        }
      });
    })
  .catch((err) => console.error('failed: ', err));

  

  const HSLAToRGBA = (h, s, l,alpha) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {"r":255 * f(0),"g": 255 * f(8),"b": 255 * f(4),"a": alpha};
  };
  
  

  app.get('/devdata', function(request, response){
    let theme=request.query.theme;
    fs.readJson('./colormanger/outputJson/188_'+theme+'.json', (err, maindata) => {
      if (err) return console.log(err);
      fs.readJson('./pattern_light.json', (err, object) => {
        if (err) return console.log(err);
        
       maindata.patterns=[];
       for(let i=0;i<object.length;i++){
        
        if(maindata.schemes[object[i].key]!=undefined){
       


          let subColors = object[i].val;
          
       
          let r=maindata.schemes[object[i].key].r;
          let g=maindata.schemes[object[i].key].g;
          let b=maindata.schemes[object[i].key].b;
          let a=maindata.schemes[object[i].key].a;

          let tobeparse='rgb ('+r+','+g+','+b+')';
         
          let parser = new Color(tobeparse);
          let main_h=parser.hsl.h;
          let main_s=parser.hsl.s;
          let main_l=parser.hsl.l;
          let main_a=maindata.schemes[object[i].key].a;
         
          for(let k=0;k<subColors.length;k++){



            maindata.patterns.push(subColors[k].key);

            let output_h=main_h+subColors[k].val.h;
            let output_s=main_s+subColors[k].val.s;
            let output_l=main_l+subColors[k].val.l;
            let output_a=Math.round((parseFloat(main_a)+parseFloat(subColors[k].val.a) )*100)/100;

            if(output_h<=0){output_h=0}
            if(output_s<=0){output_s=0}
            if(output_l<=0){output_l=0}
            if(output_a<=0){output_a=0}

            if(output_h>=360){output_h=360}
            if(output_s>=100){output_s=100}
            if(output_l>=100){output_l=100}
            if(output_a>=1){output_a=1}


            let h=output_h;
            let s=output_s+"%";
            let l=output_l+"%";
            let a=output_a;

            let tobeparseback='hsl ('+h+','+s+','+l+')';
         
            let parser = new Color(tobeparseback);

            let pp=rgba(tobeparseback);




            console.log(output_h,output_s,output_l,output_a);

            Math.round(pp[0]);
            

            let rgbast='rgba('+Math.round(Math.round(pp[0]) )+','+Math.round(pp[1])+','+Math.round(pp[2])+','+parseFloat(a)+')';

            let objectToinsert={r: Math.round(pp[0]) , g: Math.round(pp[1]) , b: Math.round(pp[2]) , a: parseFloat(a), web: rgbast};
            console.log(objectToinsert);

            maindata.schemes[subColors[k].key]=objectToinsert;



          }


        }
    

       }




       response.send(JSON.stringify(maindata, null, 2));




      });
      
    });
    
 });

  app.get('/getcurrentdata', function(request, response){
    let theme=request.query.theme;
    fs.readJson('./colormanger/temp/188_'+theme+'.json', (err, maindata) => {
      if (err) return console.log(err);
      fs.readJson('./colormanger/pattern_'+theme+'.json', (err, object) => {
        if (err) return console.log(err);
        
       maindata.patterns=[];
       for(let i=0;i<object.length;i++){
        
        if(maindata.schemes[object[i].key]!=undefined){
       


          let subColors = object[i].val;
          if(object[i].key=="color_S1_4_Football"){
            console.log("test")
          }
          let r=maindata.schemes[object[i].key].r;
          let g=maindata.schemes[object[i].key].g;
          let b=maindata.schemes[object[i].key].b;
          let a=maindata.schemes[object[i].key].a;

          let tobeparse='rgb ('+r+','+g+','+b+')';
         
          let parser = new Color(tobeparse);
          let main_h=parser.hsl.h;
          let main_s=parser.hsl.s;
          let main_l=parser.hsl.l;
          let main_a=maindata.schemes[object[i].key].a;
         
          for(let k=0;k<subColors.length;k++){



            maindata.patterns.push(subColors[k].key);

            let output_h=main_h+subColors[k].val.h;
            let output_s=main_s+subColors[k].val.s;
            let output_l=main_l+subColors[k].val.l;
            let output_a=Math.round((main_a+subColors[k].val.a )*100)/100;

            if(output_h<=0){output_h=0}
            if(output_s<=0){output_s=0}
            if(output_l<=0){output_l=0}
            if(output_a<=0){output_a=0}

            if(output_h>=360){output_h=360}
            if(output_s>=100){output_s=100}
            if(output_l>=100){output_l=100}
            if(output_a>=1){output_a=1}

            

            console.log(output_h,output_s,output_l,output_a);

           


            let h=Math.round(output_h);
            let s=Math.round(output_s);
            let l=Math.round(output_l);
            let a=output_a;


            let tobeparseback='hsl ('+h+','+s+'%,'+l+'%)';
         
            let parser = new Color(tobeparseback);






            console.log(output_h,output_s,output_l,output_a);

           
            

            let rgbast='rgba('+Math.round(parser.rgb.r )+','+Math.round(parser.rgb.g )+','+Math.round(parser.rgb.b )+','+parseFloat(a)+')';

            let objectToinsert={r: Math.round(parser.rgb.r) , g: Math.round(parser.rgb.g ) , b: Math.round(parser.rgb.b ) , a: parseFloat(a), web: rgbast};
            console.log(objectToinsert);

           




            if(subColors[k].key=="color_S1_4_Esports_lplus4"){
              console.log("test");
            }


            maindata.schemes[subColors[k].key]=objectToinsert;



          }


        }
    

       }




       response.send(JSON.stringify(maindata, null, 2));




      });
      
    });
    
 });
 
 app.post('/podata', function(request, response){
  let theme=request.query.theme;
  let jsn=request.body;
  const file = "./colormanger/outputJson/188_"+theme+".json";
  fs.outputFile(file, JSON.stringify(jsn,false,2), (err) => {
    if (err) return console.log(err);
    console.log("Data successfully written onto the file");

    response.send("ok");
  });
});



app.use('/', express.static(path.join(__dirname, './')));
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));







