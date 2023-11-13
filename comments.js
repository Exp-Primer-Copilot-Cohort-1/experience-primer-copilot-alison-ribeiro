// Create web server
var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');

// Read user data file
var user_data_file = './user_data.json'
if (fs.existsSync(user_data_file)) {
    var file_stats = fs.statSync(user_data_file);
    console.log(`${user_data_file} has ${file_stats['size']} characters`);

    var user_data = JSON.parse(fs.readFileSync('./user_data.json', 'utf-8'));
} else {
    console.log(`${user_data_file} does not exist!`);
}

// Read product data file
var product_data_file = './product_data.json'
if (fs.existsSync(product_data_file)) {
    var file_stats = fs.statSync(product_data_file);
    console.log(`${product_data_file} has ${file_stats['size']} characters`);

    var product_data = JSON.parse(fs.readFileSync('./product_data.json', 'utf-8'));
} else {
    console.log(`${product_data_file} does not exist!`);
}

app.use(myParser.urlencoded({ extended: true }));

// Process login form POST and redirect to invoice page if ok, back to login page if not
app.post("/login", function (request, response) {
    console.log(request.body);
    var login_err_msg = [];
    var username_entered = request.body["uname"];
    console.log(username_entered, "username_entered");
    // Check if username exists in user_data
    if (typeof user_data[username_entered] != 'undefined') {
        // Check if password matches
        if (user_data[username_entered]["password"] == request.body["psw"]) {
            response.redirect('/invoice.html?' + `uname=${username_entered}`);
            return;
        } else {
            login_err_msg.push = ('Invalid password');
        }
    } else {
        login_err_msg.push = ('Invalid username');
    }
    // Redirects to login page with error message
    request.query["login_err_msg"] = login_err_msg.join(';');
    response.redirect('./login.html?' + `uname=${username_entered}&login_err_msg=${login_err_msg.join(';')}`);
});

// Process register form POST and redirect to invoice page if ok, back to register page if not
app.post("/register", function (request, response) {
    console.log(request.body);
    var username_entered = request.body["uname"];
    // Check if username exists in user    