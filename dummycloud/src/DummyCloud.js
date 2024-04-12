const Logger = require("./Logger");
const net = require("net");
const Protocol = require("./Protocol");

class DummyCloud {
    constructor(dataSubscribers = []) {
        this.server = new net.Server();
        this.dataSubscribers = dataSubscribers;
    }

    initialize() {
        this.server.listen(DummyCloud.PORT, function() {
            Logger.info(`Starting deye-dummycloud on port ${DummyCloud.PORT}`);
        });

        this.server.on("connection", (socket) => {
            this.handleConnection(socket);
        });
    }

    /**
     * @private
     * @param {net.Socket} socket
     */
    handleConnection(socket) {
        const remoteAddress = socket.remoteAddress; // As this is a getter, it may become unavailable
        Logger.info(`New connection from ${remoteAddress}`);

        socket.on("data", (data) => {
            Logger.trace(new Date().toISOString(), `Data received from client: ${data.toString()}`);
            Logger.trace(new Date().toISOString(), "Data", data.toString("hex"));

            try {
                const packet = Protocol.parsePacket(data);
                let response;

                switch (packet.header.type) {
                    case Protocol.MESSAGE_REQUEST_TYPES.HEARTBEAT: {
                        response = Protocol.buildTimeResponse(packet);
                        break;
                    }
                    case Protocol.MESSAGE_REQUEST_TYPES.HANDSHAKE: {
                        const data = Protocol.parseLoggerPacketPayload(packet);
                        Logger.debug(`Handshake packet data from ${remoteAddress}`, data);
                        response = Protocol.buildTimeResponse(packet);
                        break;
                    }
                    case Protocol.MESSAGE_REQUEST_TYPES.DATA: {
                        const data = Protocol.parseDataPacketPayload(packet);

                        if (data) {
                            Logger.debug(`DATA packet data from ${remoteAddress}`, data);
                            this.dataSubscribers.forEach(subscr => subscr.handleData(data));
                        } else {
                            Logger.debug("Discarded data packet");
                        }

                        response = Protocol.buildTimeResponse(packet);
                        break;
                    }

                    default: {
                        response = Protocol.buildTimeResponse(packet);
                    }
                }

                if (response) {
                    Logger.trace("Response", response.toString("hex"));

                    socket.write(response);
                }
            } catch (e) {
                Logger.error(`Error while parsing packet from ${remoteAddress}`, e);
            }
        });

        socket.on("end", function() {
            Logger.info(`Ending connection with ${remoteAddress}`);
        });

        socket.on("close", function() {
            Logger.info(`Closing connection with ${remoteAddress}`);
        });

        socket.on("error", function(err) {
            Logger.error(`Error on dummycloud socket for ${remoteAddress}`, err);
        });
    }
}

DummyCloud.PORT = 10000;

module.exports = DummyCloud;
