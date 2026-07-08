module.exports = {
  apps: [{
    name: 'vndealz',
    script: 'node_modules/.bin/next',
    args: 'start -p 3000',
    cwd: '/opt/vndealz',
    env: {
      NODE_ENV: 'production',
    },
  }],
}
