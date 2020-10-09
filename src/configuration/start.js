const child_process = require('child_process');
var tl = require('azure-pipelines-task-lib');

async function run() {
    console.log("In the running function");
    try {
        const isTunnelActivate = tl.getInput('isTunnelActivate', true);
        console.log("isTunnelActivate : " , typeof isTunnelActivate);
        if(isTunnelActivate == "true"){
           
            let connection = tl.getInput("connection", true);
            let auth = tl.getEndpointAuthorization(connection, false);
            console.log("The value of auth is : " , auth);
            let access_key = auth.parameters["password"];
            let username = auth.parameters["username"];
            var tunnelArguments = {
                user: process.env.LT_USERNAME || username,
                key: process.env.LT_ACCESS_KEY || access_key
              };
            var filename = __dirname + '/' + 'configuration.js'; 
            try {
                var workerProcess = child_process.spawn('node', [filename, JSON.stringify(tunnelArguments)], {} ,function 
                    (error, stdout, stderr) {
                        if (error) {
                            console.log(error.stack);
                            console.log('Error code: '+error.code);
                            console.log('Signal received: '+error.signal);
                        }
                        console.log('stdout: ' , stdout);
                        console.log('stderr: ' , stderr);
                    });
                workerProcess.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                    });
                    
                workerProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
                });
            }
            catch(er) {
                console.log(er);
            }  
            console.log("at the end of main process"); 
        } else {
            console.log("isTunnelActivate : " , isTunnelActivate);
            console.log("no need to activate the tunnel");
            return;
        }
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();


















