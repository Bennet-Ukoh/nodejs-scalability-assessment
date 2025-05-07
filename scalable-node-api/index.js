const cluster = require("cluster");
const os = require("os");
const express = require("express");
const { pid } = require("process");

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 3000;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} forking for ${numCPUs} workers... `);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died; spawning a new one...`);
    cluster.fork();
  });
} else {
  const app = express();

  app.get("/", (req, res) => {
    res.json({
      pid: process.pid,
      message: "Hello from the Node.js API!",
    });
  });

  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started and listening on port ${PORT}`);
  });
}
