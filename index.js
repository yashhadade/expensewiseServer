import express from 'express'
import custer from 'cluster'
import os from 'os'
import cluster from 'cluster';

const totalCPUs=os.cpus().length;

// const port=3000

if(cluster.isPrimary){
    console.log(`Number of CPUs is ${totalCPUs}`)
    console.log(`Primary ${process.pid}`);
    
    for (let i=0;i<totalCPUs;i++){
        cluster.fork();
    }
    cluster.on("exit",(worker,code,signal)=>{
        console.log(`worker ${worker.process.id} died`)
        console.log("Lets Fork another worker");4
        cluster.fork()

    })
}else{
    import("./app.js");
}
