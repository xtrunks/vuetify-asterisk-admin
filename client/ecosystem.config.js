module.exports = {
  apps: [
    {
      name: "dashboard",
      script: "./node_modules/nuxt/bin/nuxt-start",
      env: {
        HOST: "0.0.0.0",
        PORT: 4444,
        NODE_ENV: "production"
      }
    }
  ]
}
