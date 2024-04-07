const DummyCloud = require("./src/DummyCloud");
const Logger = require("./src/Logger");
const HttpServer = require("./src/HttpServer");

if (process.env.LOGLEVEL) {
    Logger.setLogLevel(process.env.LOGLEVEL);
}

const dummyCloud = new DummyCloud();
const httpServer = new HttpServer(dummyCloud);

dummyCloud.initialize();
httpServer.initialize();
