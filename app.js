const exec = require('child_process');

exec.exec('node bin/backend/server.js');
console.log('Сервер успешно запущен! Теперь необходимо перейти на localhost:3000')
