const http = require("http");
const Logger = require("./Logger");

const DEFAULT_PORT = 10100;
const MAX_AGE = 11 * 60 * 1000; // 11 Minuten in Millisekunden

class HttpServer {

    constructor() {
        this.data = null;
    }

    initialize() {
        var port = DEFAULT_PORT;
        if (process.env.HTTP_PORT) {
            port = process.env.HTTP_PORT;
        }

        const self = this;
        http.createServer((req, res) => self.handleRequest(req, res)).listen(port);
        Logger.info(`Started HTTP server on port ${port}.`);
    }

    handleData(data) {
        try {
            //Nur wenn gültiges Datum enthalten ist, scheint das Datenpaket valide zu sein
            data.inverter_meta.current_time.toISOString();
            this.data = data;
        } catch {}
    }

    handleRequest(req, res) {
        if (this.data != null && Date.now() - this.data.inverter_meta.current_time.getTime() > MAX_AGE) {
             this.data = null;
        }
        Logger.debug("HTTP Response:", this.data);
        res.setHeader('Content-Type', 'application/json'); 
        res.write(JSON.stringify(this.data, false, 2));
        res.end();
    } 
}
module.exports = HttpServer;
