const fs = require("fs");
const Logger = require("./Logger");

const CSV_FILE = "data.csv";

class CsvLogger {

    initialize() {
        if (fs.existsSync(CSV_FILE)) {
            Logger.info(`Data will be logged to: ${CSV_FILE}`);
        } else {
            Logger.info(`File not found: ${CSV_FILE}`);
        }
    }

    handleData(data) {
        const line = `${new Date().toISOString()};${this.pv(data.pv["1"])};${this.pv(data.pv["2"])};${this.pv(data.pv["3"])};${this.pv(data.pv["4"])};${this.grid(data.grid)};${this.inverter(data.inverter)};${this.inverter_meta(data.inverter_meta)}\n`;
        Logger.trace(line);
        fs.appendFile(CSV_FILE, line, err => {
            if (err) {
                Logger.error(err);
            }
        });
    }

    pv(pv) {
        return `${pv.v};${pv.i};${pv.w};${pv.kWh_today};${pv.kWh_total}`;
    }

    grid(grid) {
        return `${grid.active_power_w};${grid.kWh_today};${grid.kWh_total};${grid.v};${grid.i};${grid.hz}`;
    }

    inverter(inverter) {
        return inverter.radiator_temp_celsius;
    }

    inverter_meta(meta) {
        var current_time = meta.current_time;
        try {
            current_time = current_time.toISOString();
        } catch {}
        return `${meta.rated_power_w};${meta.mppt_count};${meta.startup_self_check_time};${current_time};${meta.grid_freq_hz_overfreq_load_reduction_starting_point};${meta.grid_overfreq_load_reduction_percent};${meta.grid_v_limit_upper};${meta.grid_v_limit_lower};${meta.grid_freq_hz_limit_upper};${meta.grid_freq_hz_limit_lower};${meta.protocol_ver};${meta.dc_master_fw_ver};${meta.ac_fw_ver}`;
    }
}
module.exports = CsvLogger;
