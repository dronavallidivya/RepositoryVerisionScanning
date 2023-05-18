// Octokit.js
// https://github.com/octokit/core.js#readme
const { Octokit } = require("@octokit/rest")
var async = require('async');
const octokit = new Octokit({
  auth: ''
})
const fs = require('fs');
let javascriptCount = 0;

var repositoryVersion = new Map();
async function getFileContents(name) {
   let res = await octokit.request('GET /repos/'+'benchmarkeducation'+'/'+name+'/contents/package.json', {
                headers: {
                        'X-GitHub-Api-Version': '2022-11-28',
                        'accept': 'application/vnd.github.VERSION.raw'
                        }
        })
                if(res.status == 200){
                   // console.log(res.data)
                }
                if(res.status == 404){

                }
    
     return res;
   }



async function getLanguages(owner,name,url,download_url) {
    const languageVersion = new Array();
    //console.log("prop values : ",name);
    let response =  await octokit.request('GET /repos/'+'benchmarkeducation'+'/'+name+'/languages', {
    
     headers: {
       'X-GitHub-Api-Version': '2022-11-28'
     }
     })
   
     if(response.status == 200){
        languageVersion[0]=new Object(name);
        languageVersion[1]=new Object(url);
        languageVersion[2]=new Object(JSON.stringify(response.data));
        //if(JSON.stringify(response.data).includes("JavaScript")){
         if(1) {
            javascriptCount  = javascriptCount+1;
            try{
               getFileContents(name).then(res => {
                //languageVersion[3]=new Object(JSON.stringify(res.data));
                var info = JSON.parse(res.data);    
                var reactVersion = info.data.dependencies.react;
                console.log(reactVersion);
                var reactDomVersion = info.data.dependencies.react-dom;
                console.log(reactDomVersion);
                languageVersion[3] = reactVersion;
                languageVersion[4] = reactDomVersion;
                var O = languageVersion.map( (e, i) => ( (i + 1) + "=" + e) ).join(' =');
                //console.log(O);
                O += "\n";
                fs.appendFile('./versions.csv', O, err => {
                if (err) {
                  console.error(err);
                }
  // done!
}); 
                
                
                 
            }).catch(err => {
                //console.log(err)
            });
           
            }
            catch{
                
            }
                }
            
        
    }
     return response;
   }



async function fetchRepos() {
 let response =  await octokit.request('GET /orgs/benchmarkeducation/repos', {
  org: 'ORG',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
  })
  if(response.status == 200){

   // console.log(" 36:", JSON.stringify(response))
    let ResposeData = response.data;

    if(ResposeData && ResposeData.length>0){
        let TaskList = [];
        console.log("response data length:"+ResposeData.length)
        ResposeData.forEach(element => {
            console.log(element.name)
            TaskList.push(getLanguages(element.owner,element.name,element.html_url,element.download_url));
        });
        let TaskRes = await Promise.all(TaskList);
        console.log("javascript count: "+javascriptCount);
        //console.log(" TaskRes  : ", TaskRes)
       
    }
   }
  return response;
}

fetchRepos();
