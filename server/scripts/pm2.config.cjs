module.exports = {
  apps: [
    {
      name: 'chat',
      script: './run.sh',
      max_size: '10M',
      merge_logs: true,
      max_file: '5'
    }
  ]
};
