module.exports = {
  apps: [
    {
      name: "quickquack-backend",
      script: "./server.js",
      instances: "max",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M"
    }
  ]
};