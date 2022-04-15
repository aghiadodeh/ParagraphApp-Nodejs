import fs from 'fs';

export default {

    getFileSizeInBytes: (filepath) => {
        var stats = fs.statSync(filepath);
        var fileSizeInBytes = stats.size;
        return fileSizeInBytes;
    },
    getFileSizeInKilobytes: (filepath) => {
        var stats = fs.statSync(filepath);
        var fileSizeInBytes = stats.size;
        var fileSizeInMegabytes = fileSizeInBytes / 1024;
        return (Number)(fileSizeInMegabytes.toFixed(2));
    },
    getFileSizeInMegabytes: (filepath) => {
        var stats = fs.statSync(filepath);
        var fileSizeInBytes = stats.size;
        var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
        return (Number)(fileSizeInMegabytes.toFixed(2));
    },
    abbreviateNumber(number) {
        const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];
        // what tier? (determines SI symbol)
        var tier = Math.log10(Math.abs(number)) / 3 | 0;

        // if zero, we don't need a suffix
        if (tier == 0) return number;

        // get suffix and determine scale
        var suffix = SI_SYMBOL[tier];
        var scale = Math.pow(10, tier * 3);

        // scale the number
        var scaled = number / scale;

        // format number and add suffix
        return scaled.toFixed(1) + suffix;
    },
}