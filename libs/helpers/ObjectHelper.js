import Constants from "../config/constants";

export default {
    /**
     * Get `page` and `per_page` from any object if keys is exist or return default values
     * @param {Object} object object contains `page` and `per_page` keys
     * @returns page, per_page
     */
    paginationData: (object) => {
        const data = object ? object : { per_page: Constants.perPage, page: 1 };
        const per_page = parseInt(data.per_page || Constants.perPage);
        const page = parseInt(data.page || 1);
        const skip = (per_page * page) - per_page;
        return { per_page, skip };
    },

    /**
     * make first char in string Uppercase
     * @param {String} username 
     * @returns same passed string
     */
    firstUpper: (username) => {
        const name = username.toLowerCase();
        return name.charAt(0).toUpperCase() + name.slice(1);
    },

    /**
     * validate email
     * @param {String} email 
     * @returns Boolean if email is valid
     */
    isEmailVaild: (email) => {
        const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        if (!email) return false;

        if (email.length > 254) return false;

        var valid = emailRegex.test(email);
        if (!valid) return false;

        // Further checking of some things regex can't handle
        var parts = email.split("@");
        if (parts[0].length > 64) return false;

        var domainParts = parts[1].split(".");
        if (
            domainParts.some(function (part) {
                return part.length > 63;
            })
        )
            return false;

        return true;
    },
};