var tl = require('azure-pipelines-task-lib');
var lambdaTunnel = require('@lambdatest/node-tunnel');

async function run(jobName) {
  try {
    var connection = tl.getInput("connection", true);
    if(connection !== undefined) {
      var auth = tl.getEndpointAuthorization(connection, false);
      if(auth !== undefined) {
        console.log("##vso[task.setvariable variable=lt_username;]", auth.parameters["username"]);
        console.log("##vso[task.setvariable variable=lt_access_key;]", auth.parameters["password"]);
        console.log("##vso[task.setvariable variable=lt_grid_url;]hub.lambdatest.com/wd/hub");

        const isTunnelActivate = tl.getInput('isTunnelActivate', true);
        if(isTunnelActivate == "true"){
          if(typeof tl.getInput("tunnelOptions", false) !== "undefined"){
            var tunnelOptions = JSON.parse(tl.getInput("tunnelOptions", false));
            if(tunnelOptions.tunnelName === undefined) {
              tunnelOptions.tunnelName = 'azure-lambdatest-tunnel' + "-" + jobName;
            }
          }
          else {
            var tunnelOptions = {
              "tunnelName":"azure-lambdatest-tunnel" + "-" + jobName
            }
          }

          console.log("##vso[task.setvariable variable=lt_tunnel_name;]", tunnelOptions.tunnelName);

          var tunnelInstance = new lambdaTunnel();
          var tunnelCredentials = {
              user: auth.parameters["username"],
              key: auth.parameters["password"]
            };
          
          var tunnelArguments = {
            ...tunnelCredentials,
            ...tunnelOptions
          }; 
    
          try {
              const istunnelStarted = await tunnelInstance.start(tunnelArguments);
              if(istunnelStarted) {
                  console.log('Tunnel is Running Successfully');
                  const tunnelName = await tunnelInstance.getTunnelName();
                  console.log('Tunnel Name : ' + tunnelName);
              }
          } 
          catch (error) {
              console.log(error);
          }
          
          console.log("##vso[task.setvariable variable=tunnel_pid;]", tunnelInstance.proc.pid);
        } 
        else {
            console.log("isTunnelActivate : " , isTunnelActivate);
            return;
        }
        tl.setResult(tl.TaskResult.Succeeded, 'tunnel completed his work. closing it now',true);
      } 
      else {
        console.log("Authentication is not valid. Please enter correct credentials and try again!!");
      }
    }
    else {
      console.log("Connection can't be established. Please try again!!");
    }
  } 
  catch (err) {
      tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

function search(nameKey, myArray){
  for (var i=0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
          return myArray[i];
      }
  }
}


var infoArr = tl.getVariables();
var jobDetail = search("system.jobDisplayName", infoArr);
console.log(jobDetail);
jobName = jobDetail.value.replace(/\s/g, '-');
console.log(jobName);
run(jobName);
