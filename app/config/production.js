
module.exports = {
  Config: {
    port: process.env.VCAP_APP_PORT || process.env.PORT || 3000,
    interval: 1000 * 60 * 30,
    staticMaxAge: 3600000 * 24 * 15,
    limit: 15
  }

};