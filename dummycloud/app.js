const DummyCloud = require("./src/DummyCloud");
const Logger = require("./src/Logger");
const HttpServer = require("./src/HttpServer");
const CsvLogger = require("./src/CsvLogger");

if (process.env.LOGLEVEL) {
    Logger.setLogLevel(process.env.LOGLEVEL);
}

const httpServer = new HttpServer();
httpServer.initialize();
const dataSubscribers = [httpServer];

if (process.env.LOG_DATA === true || Logger.isTrace()) {
    const csvLogger = new CsvLogger();
    csvLogger.initialize();
    dataSubscribers.push(csvLogger);
}


const dummyCloud = new DummyCloud(dataSubscribers);
dummyCloud.initialize();

