const PROXY_PATH_PREFIX = process.env.PROXY_PATH_PREFIX || '/';

// TODO: It's difficult for me to understand what this anonymous function does. Can you somehow describe what the purpose of this function is? Either by naming the function, or adding a comment?
module.exports.proxyPath = (enpointPath) => {
    let sep="/";
    if (PROXY_PATH_PREFIX.endsWith("/") || enpointPath.startsWith("/")) {
        sep=""
    }
    return [PROXY_PATH_PREFIX, sep, enpointPath].join("");
}
