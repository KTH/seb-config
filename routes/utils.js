const PROXY_PATH_PREFIX = process.env.PROXY_PATH_PREFIX || '/';

module.exports.proxyPath = (enpointPath) => {
    let sep="/";
    if (PROXY_PATH_PREFIX.endsWith("/") || enpointPath.startsWith("/")) {
        sep=""
    }
    return [PROXY_PATH_PREFIX, sep, enpointPath].join("");
}