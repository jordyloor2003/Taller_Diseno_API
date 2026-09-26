// module.exports = {
//   apps : [{
//     script: 'index.js',
//     watch: '.'
//   }, {
//     script: './service-worker/',
//     watch: ['./service-worker']
//   }],

//   deploy : {
//     production : {
//       user : 'SSH_USERNAME',
//       host : 'SSH_HOSTMACHINE',
//       ref  : 'origin/master',
//       repo : 'GIT_REPOSITORY',
//       path : 'DESTINATION_PATH',
//       'pre-deploy-local': '',
//       'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
//       'pre-setup': ''
//     }
//   }
// };

module.exports = {
    apps: [{
        name: "api-backend",
        script: "./dist/index.js",
        instances: "max", // Modo Cluster: usa todos los núcleos de la CPU
        exec_mode: "cluster",
        // Producción: Variables de entorno protegidas
        env: {
            NODE_ENV: "production",
            PORT: 3000,
            MONGO_URI: "mongodb+srv://jloorm2003:MBJ4c0HxHwctZHQK@db-vuelos.yt77m.mongodb.net/?appName=db-vuelos"
        },
        // Logs y Monitoreo del Servidor
        error_file: "/var/www/gestion_clientes/logs/err.log",
        out_file: "/var/www/gestion_clientes/logs/out.log",
        log_date_format: "YYYY-MM-DD HH:mm:ss Z",
        merge_logs: true
    }],
    // Automatización del Despliegue desde tu PC local
    deploy: {
        production: {
            user: 'ubuntu',
            host: '77.112.117.115',
            ref: 'origin/backend',
            repo: 'git@github.com:jordyloor2003/Taller_Diseno_API.git',
            path: '/var/www/gestion_clientes',
            'post-deploy': 'cd backend && mkdir -p /var/www/gestion_clientes/logs && npm install && npm run build && pm2 reload ecosystem.config.cjs --env production && pm2 save',
            key: 'C:/Users/JordyA/Downloads/claveServer.pem',
            ssh_options: 'StrictHostKeyChecking=no'
        }
    }
}