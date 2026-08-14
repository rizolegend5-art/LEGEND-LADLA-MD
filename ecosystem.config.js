module.exports = {
  apps : [{
    name: "LEGEND LADLA LEGEND LADLI MD",
    script: "./index.js",
    watch: false,
    autorestart: true,
    max_memory_restart: '2G',
    env: {
      NODE_ENV: "production",
    }
  }]
};
