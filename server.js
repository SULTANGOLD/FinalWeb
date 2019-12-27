const http = require('http');
const fs = require('fs');
const route = require('url');
const qs = require('querystring');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/usersDB', { useNewUrlParser: true },(err)=> {
    !err ? console.log('Success') : console.log('Error to connect database');
});


function handleServer(req, res) {
    let path = route.parse(req.url, true);
    let query = path.query;

    if(req.url === '/') {
        res.writeHead(200, {"Content-Type": "text/html"});
        fs.createReadStream('./register.html').pipe(res);
        fs.createReadStream('./delete.html').pipe(res);
        fs.createReadStream('./change.html').pipe(res);
    }
    else if(path.pathname === '/info' && req.method === 'POST') {
        let rawData = '';

        req.on('data', data => {
            rawData += data;

            //Avoid hige data from user
            rawData.length > 1e6? (rawData = '', 
                re.connection.destroy(), 
                res.writeHead(413, {'Content-Type' : 'text/plain'}.end('Too much data'))): '';})
                    .on('end', () => {
                    let info = qs.parse(rawData);
                    res.writeHead(200, {'Content-Type' : 'text/plain'});
                    let myObj = {name: info.firstname, lastname: info.lastname, email: info.email ,password: info.password}
                    mongoose.connection.collection('users').insertOne(myObj, function(err, res) {
                        if (err) throw err;
                        console.log("1 document inserted");
                    });
                    mongoose.connection.collection('users').find().toArray(function(err, result) {
                        if (err) throw err;
                        res.end(JSON.stringify(result));
                    });
                });
    }
    else if(path.pathname === '/infoDel' && req.method === 'POST') {
        let rawData = '';

        req.on('data', data => {
            rawData += data;

            //Avoid hige data from user
            rawData.length > 1e6? (rawData = '', 
                re.connection.destroy(), 
                res.writeHead(413, {'Content-Type' : 'text/plain'}.end('Too much data'))): '';})
                    .on('end', () => {
                    let info = qs.parse(rawData);
                    res.writeHead(200, {'Content-Type' : 'text/plain'});
                    let myObj = {name: info.firstname, lastname: info.lastname}
                    mongoose.connection.collection('users').deleteOne(myObj, function(err, result) {
                        if (err) {
                            res.writeHead(404, {'Content-Type' : 'text/plain'});
                            res.end('Page not found');
                        }
                    });
                    mongoose.connection.collection('users').find().toArray(function(err, result) {
                        if (err) throw err;
                        res.end(JSON.stringify(result));
                    });
                });
    }
    else if(path.pathname === '/infoup' && req.method === 'POST') {
        let rawData = '';

        req.on('data', data => {
            rawData += data;

            //Avoid hige data from user
            rawData.length > 1e6? (rawData = '', 
                re.connection.destroy(), 
                res.writeHead(413, {'Content-Type' : 'text/plain'}.end('Too much data'))): '';})
                    .on('end', () => {
                    let info = qs.parse(rawData);
                    res.writeHead(200, {'Content-Type' : 'text/plain'});
                    let query = {name: info.from_firstname, lastname: info.from_lastname}
                    var newvalues = { $set: {name: info.to_lastname, lastname: info.to_lastname } };
                    mongoose.connection.collection('users').updateOne(query, newvalues, function(err, result) {
                        if (err) {
                            res.writeHead(404, {'Content-Type' : 'text/plain'});
                            res.end('Error');
                        }
                    });
                    mongoose.connection.collection('users').find().toArray(function(err, result) {
                        if (err) throw err;
                        res.end(JSON.stringify(result));
                    });
                });
    }
    else {
        res.writeHead(404, {'Content-Type' : 'text/plain'});
        res.end('Page not found');
    }
}



http.createServer(handleServer).listen(8080);
console.log('Server is running on port 8080');