const http =require("http");
const fs=require("fs");
var requests=require("requests");
const { join } = require("path");

const homeFile=fs.readFileSync("home.html","UTF-8");

const replaceVal=(tempVal,orgVal)=>
{
let temperature=tempVal.replace("{%tempval%}",(orgVal.main.temp -273.15).toFixed(2));   
 temperature=temperature.replace("{%tempmin%}",(orgVal.main.temp_min -273.15).toFixed(2));   
 temperature=temperature.replace("{%tempmax%}",(orgVal.main.temp_max-273.15).toFixed(2));   
 temperature=temperature.replace("{%location%}",orgVal.name);   
 temperature=temperature.replace("{%country%}",orgVal.sys.country);
 temperature=temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
 return temperature;   

} 

const server=http.createServer( (req,res)=>{
  console.log(req.url);
     if(req.url=="/")
     {
   requests("http://api.openweathermap.org/data/2.5/weather?q=chandigarh&appid=d3d70b93783fcf76f6e9160aaf316e20")
   .on("data",(chunk)=>{
       const obj=JSON.parse(chunk);
       const arrData=[obj];
       
      // const realTimeData=arrData.map((val)=> replaceVal(homeFile,val));
      const realTimeData=replaceVal(homeFile,arrData[0]);
     
      res.write(realTimeData);
     
    })
   .on("end",(err)=>{

       if(err) return console.log("Connection closed due to errors",err);
      res.end();
   });
     }
     if(req.url=='/style.css')
     {
      const puli= fs.readFileSync("style.css","UTF-8");
    res.end(puli);
     }
});  

 server.listen(3000);  