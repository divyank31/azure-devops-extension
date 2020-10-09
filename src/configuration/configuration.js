var tl = require('azure-pipelines-task-lib');
var lambdaTunnel = require('@lambdatest/node-tunnel');
const { exec } = require('child_process');

async function run() {
  try {
    const isTunnelActivate = tl.getInput('isTunnelActivate', true);
    if(isTunnelActivate == "true"){
      var flag = 0;
      if(typeof tl.getInput("tunnelOptions", false) !== 'undefined'){
        var tunnelOptions = JSON.parse(tl.getInput("tunnelOptions", false));
        flag =1;
      }
      let connection = tl.getInput("connection", true);
      let auth = tl.getEndpointAuthorization(connection, false);

      var tunnelInstance = new lambdaTunnel();
      tl.setVariable("tunnelInstance",tunnelInstance);
      var tunnelCredentials = {
          user: auth.parameters["username"],
          key: auth.parameters["password"]
        };
      
      if(flag == 1) {
        var tunnelArguments = {
          ...tunnelCredentials,
          ...tunnelOptions
        }; 
      }
      else{
        var tunnelArguments = tunnelCredentials;
      }

      var isWin = process.platform === "win32";
      if(isWin) {

      } 
      else {
        exec('echo "export LT_USERNAME=' + tunnelCredentials.user + '" >> ~/.bashrc', (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.error(`stderr: ${stderr}`);
        });

        exec('echo "export LT_ACCESS_KEY=' + tunnelCredentials.key + '" >> ~/.bashrc', (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.error(`stderr: ${stderr}`);
        });

        exec('echo "export LT_GRID_URL=hub.lambdatest.com/wd/hub" >> ~/.bashrc', (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.error(`stderr: ${stderr}`);
        });
      }

      try {
          const istunnelStarted = await tunnelInstance.start(tunnelArguments);
          if(istunnelStarted) {
              console.log('Tunnel is Running Successfully');
              const tunnelName = await tunnelInstance.getTunnelName();
              console.log('Tunnel Name : ' + tunnelName);
              if(isWin) {

              } 
              else {
                exec('echo "export LT_TUNNEL_NAME=' + tunnelName + '" >> ~/.bashrc', (error, stdout, stderr) => {
                  if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                  }
                  console.error(`stderr: ${stderr}`);
                });
              }
          }
      } catch (error) {
          console.log(error);
      }
    } else {
        console.log("isTunnelActivate : " , isTunnelActivate);
        return;
    }
    tl.setResult(tl.TaskResult.Succeeded, 'tunnel completed his work. closing it now',true);
  } catch (err) {
      tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
