let appConfig = {}

appConfig.port = 4200;
appConfig.allowedCorsOrigin = "*";
appConfig.env = "dev";
appConfig.db = {

    uri : "mongodb://127.0.0.1:27017/project2"
}

appConfig.apiVersion = '/api/v1';

module.exports = {

    port:appConfig.port,
    allowedCorsOrigin:appConfig.allowedCorsOrigin,
    env:appConfig.env,
    db:appConfig.db,
    apiVersion:appConfig.apiVersion
}