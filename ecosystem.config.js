module.exports = {
  apps: [{
    name: 'vndealz',
    script: 'node_modules/.bin/next',
    args: 'start -p 3003',
    cwd: '/opt/vndealz',
    env: {
      NODE_ENV: 'production',
    },
  }],
}
