module.exports = {
    apps: [
      {
        name: 'evolve-api',
        cwd: './be',
        script: 'app.js',
        env: {
          NODE_ENV: 'development'
        },
        env_production: {
          NODE_ENV: 'production'
        },
        watch: true,
        ignore_watch: ['node_modules', 'logs'],
        instances: 1,
        exec_mode: 'fork',
        autorestart: true,
        max_memory_restart: '1G',
        error_file: './logs/backend-error.log',
        out_file: './logs/backend-out.log',
        merge_logs: true,
        time: true
      },
      {
        name: 'evolve-fe',
        cwd: './fe',
        script: 'npx',
        args: 'vite --host 0.0.0.0 --port 5144 --strictPort',
        env: {
          NODE_ENV: 'development'
        },
        env_production: {
          NODE_ENV: 'production'
        },
        watch: false,  // Disable PM2 watching - let Vite handle file watching
        instances: 1,
        exec_mode: 'fork',
        autorestart: true,
        max_memory_restart: '1G',
        error_file: './logs/frontend-error.log',
        out_file: './logs/frontend-out.log',
        merge_logs: true,
        time: true
      }
    ]
  };
  