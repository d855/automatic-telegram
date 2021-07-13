var app = require('express')();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wsblogpost'
})

connection.connect();

io.on('connection', (socket) => {
    console.log('Client with an id: ' + socket.id + ' has connected');

    socket.on('loadArticles', function() {
        connection.query('SELECT * FROM articles', (error, results) => {
            io.emit('articlesUpdated', results);
        })
    })

    socket.on('addNewArticle', data => {
        connection.query('INSERT INTO articles SET ?', data, () => {
            connection.query('SELECT * FROM articles', (error, results) => {
                io.emit('articlesUpdated', results);
            })
        })
    })

    socket.on('deleteArticle', data => {
        connection.query('DELETE FROM articles WHERE id= ' + data);
        connection.query('INSERT INTO articles SET ?', data, () => {
            connection.query('SELECT * FROM articles', (error, results) => {
                io.emit('articlesUpdated', results);
            })
        })
    })

    socket.on('updateArticle', data => {
        connection.query('UPDATE articles SET ? WHERE id = ' + data.id, data, () => {
            connection.query('SELECT * FROM articles', (error, results) => {
                io.emit('articlesUpdated', results);
            })
        })
    })
    
    
})


server.listen(3000, () => {
    console.log('Server on port http://localhost:3000')
})