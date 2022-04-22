const ip = require('ip');
const os = require('os');

module.exports = {
    getIpAddress: () => {
        let ipAddress = "https://www.domain.com";
        try {
            let networkInterfaces = os.networkInterfaces();
            const ipV4 = networkInterfaces['Wi-Fi'].find(e => e.family = "IPv4");
            ipAddress = ipV4.address;
            ipAddress = `http://${ipAddress}`;
        } catch (error) {
            ipAddress = ip.address();
            ipAddress = `https://${ipAddress}`;
        }
        return ipAddress;
    }
}