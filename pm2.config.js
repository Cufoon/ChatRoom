module.exports = {
  apps: [
    {
      name: 'cufoon-chat-room-web',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: '.',
        PM2_SERVE_PORT: 8080,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html'
      },
      cwd: './client/dist/'
    },
    {
      name: 'cufoon-chat-room-service',
      script: './server/build/main.bundle.cjs',
      cwd: './server/build/'
    }
  ]
};
