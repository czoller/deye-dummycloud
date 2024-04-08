const DummyCloud = require("./src/DummyCloud");
const Logger = require("./src/Logger");
const HttpServer = require("./src/HttpServer");
const CsvLogger = require("./src/CsvLogger");

if (process.env.LOGLEVEL) {
    Logger.setLogLevel(process.env.LOGLEVEL);
}

const httpServer = new HttpServer();
const csvLogger = new CsvLogger();
const dummyCloud = new DummyCloud(httpServer, csvLogger);

httpServer.initialize();
csvLogger.initialize();
dummyCloud.initialize();
