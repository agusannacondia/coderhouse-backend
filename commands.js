// FORK

// pm2 start server.js --name="server_x" --watch -- PORT
// pm2 start server.js --name="server_1" --watch -- 8081
// pm2 start server.js --name="server_2" --watch -- 8082

// CLUSTER

// pm2 start server.js --name="server_x" --watch -i max -- PORT
// pm2 start server.js --name="server_1" --watch -i max -- 8083
// pm2 start server.js --name="server_2" --watch -i max -- 8084

// OTHER COMMANDS

// pm2 list
// pm2 delete id
// pm2 delete all
// pm2 desc name
// pm2 monit
// pm2 --help
// pm2 logs
// pm2 flush
