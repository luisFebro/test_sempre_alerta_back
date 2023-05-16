exports.CLIENT_URL =
    process.env.NODE_ENV === "production"
        ? "https://maricatelecom.com.br"
        : "http://localhost:3000";

const ENVIRONMENT = process.env.NODE_ENV || "development";
const isProd = ENVIRONMENT === "production";

exports.IS_PROD = isProd;
exports.IS_DEV = ENVIRONMENT === "development";

// exports.ROOT_DOMAIN = isProd
//     ? "https://maricatelecom.herokuapp.com"
//     : "http://localhost:5000";
