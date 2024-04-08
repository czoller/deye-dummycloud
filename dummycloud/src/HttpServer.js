const http = require("http");
const Logger = require("./Logger");

const DEFAULT_PORT = 10100;

class HttpServer {
    /**
     * 
     * @param {import("./DummyCloud")} dummyCloud
     */
    constructor() {
        this.data = null;
    }

    initialize() {
        var port = DEFAULT_PORT;
        if (process.env.HTTP_PORT) {
            port = process.env.HTTP_PORT;
        }

        const self = this;
        http.createServer(function (req, res) {
            res.write(JSON.stringify(self.data, false, 2)); //write a response to the client
            res.end(); //end the response
        }).listen(port); //the server object listens on port 8080
        Logger.info(`Started HTTP server on port ${port}.`);
    }

    handleData(data) {
        try {
            //Nur wenn gültiges Datum enthalten ist, scheint das Datenpaket valide zu sein
            data.inverter_meta.current_time.toISOString();
            this.data = data;
        }
        catch (e) {}
    }
}
module.exports = HttpServer;
