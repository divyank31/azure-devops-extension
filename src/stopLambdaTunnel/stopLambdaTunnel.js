if(process.env.TUNNEL_PID === undefined) {
    console.log("Tunnel is not running");
}
else {
    if (process.platform === 'win32') {
        childProcess.exec('taskkill /F /PID ' + process.env.TUNNEL_PID);
        console.log("Tunnel stopped successfully");
    } 
    else {
        childProcess.exec('kill -9 ' + process.env.TUNNEL_PID);
        console.log("Tunnel stopped successfully");
    }
}








