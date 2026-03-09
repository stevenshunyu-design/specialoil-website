module.exports = {
  apps: [
    {
      name: 'specialoil-api',
      script: 'npx',
      args: 'tsx server.ts',
      cwd: '/var/www/specialoil',
      env: {
        NODE_ENV: 'production',
        API_PORT: 3001
      }
    },
    {
      name: 'specialoil-web',
      script: 'npx',
      args: 'serve dist -l 5000',
      cwd: '/var/www/specialoil',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
