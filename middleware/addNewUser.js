
var mysql = require("mysql");
var express = require("express");
var md5 = require("MD5");
var connection = require("../database");
var validator = require("email-validator");

var addNewUser = function (req, res, next) {
	var date = new Date();
	var post = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: md5(req.body.password),
		dob: req.body.dob,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		device_type: req.body.device_type,
		device_token: req.body.device_token,
		// time_zone:req.body.time_zone

	};
	console.log(req.body)
	if(req.body.email == '' || req.body.email === undefined){
		return res.json({ "Error": true, "code": 400, "Message": "Please provide a email address" });
	} 
	if(!  validator.validate(req.body.email) ){
		return res.json({ "Error": true, "code": 400, "Message": "Please provide a valid email address" });
	}

	console.log(req.body);
	var query = "SELECT email FROM ?? WHERE ??=?";
	var table = ["user", "email", post.email];
	query = mysql.format(query, table);
	connection.query(query, function (err, rows) {
		if (err) {
			res.json({ "Error": true, "code": 400, "Message": "Error executing MySQL query" });
		}
		else {
			if (rows.length == 0) {
				var query = "INSERT INTO  ?? SET  ?";
				var table = ["user"];
				query = mysql.format(query, table);
				connection.query(query, post, function (err, rows) {
					if (err) {
						res.json({ "Error": true, "code": 400, "Message": "Error executing MySQL query" });
					} else {
						res.json({ "Error": false, "code": 200, "Message": "Success" });
					}
				});

			}
			else {
				res.json({ "Error": false, "Message": "Email Id already registered" });
			}
		}
	});
}

module.exports = addNewUser;


