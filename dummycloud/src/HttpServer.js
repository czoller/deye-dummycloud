const http = require("http");
const Logger = require("./Logger");

const DEFAULT_PORT = 10100;

class HttpServer {
    /**
     * 
     * @param {import("./DummyCloud")} dummyCloud
     */
    constructor(dummyCloud) {
        dummyCloud.onData((data) => {
            this.handleData(data);
        });
        this.data = null;
    }

    initialize() {
        var port = DEFAULT_PORT;
        if (process.env.HTTP_PORT) {
            port = process.env.HTTP_PORT;
        }

        http.createServer(function (req, res) {
            res.write("Hello World!"); //write a response to the client
            res.end(); //end the response
        }).listen(port); //the server object listens on port 8080
        Logger.info(`Started HTTP server on port ${port}.`);
    }

    handleData(data) {
        this.data = data;
    }
}
module.exports = HttpServer;
