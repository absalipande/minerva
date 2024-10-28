module.exports = {
  apps: [
    {
      name: 'minerva',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
