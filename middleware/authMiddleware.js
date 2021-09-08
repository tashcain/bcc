const jwt = require("jsonwebtoken");
var express = require("express");
var cookieParser = require("cookie-parser");
const sql = require("../database.js");
const sqlCon = sql;

var app = express();
app.use(cookieParser());

const requireAuth = (req, res, next) => {
  var cookies = parseCookies(req);
  console.log(cookies.jwt);

  const token = cookies.jwt;

  //check if json webtoken exist and is valid
  if (token) {
    jwt.verify(token, "stringSecret", (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect("/home");
      } else {
        console.log(decodedToken);

        next();
      }
    });
  } else {
    res.redirect("/home");
  }
};

//check current user
const checkCurrentUser = (req, res, next) => {
  var cookies = parseCookies(req);
  let token = cookies.jwt;
  let urlToken = cookies.urlJwt;

  if (token) {
    jwt.verify(token, "stringSecret", (err, decodedToken) => {
      if (err) {
        console.log(err);
        next();
      } else {
        console.log(decodedToken);
        let sql =
          "SELECT email,name,mobileNumber,companyName,plan FROM users WHERE email = ?";
        sqlCon.query(sql, [decodedToken.id], async (err, result) => {
          if (err) console.log(err);
          console.log(result[0]);

          // req.middlewareUser = await result[0];
          res.locals.user = await result[0];
          req.email = res.locals.user.email;
          console.log("------------------------", req.email);
          req.isSignedIn = true;
          next();
        });
      }
    });
  } else if (urlToken) {
    jwt.verify(urlToken, "urlStringSecret", (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.render("/home");
      } else {
        console.log("user is paying", decodedToken);
        req.user = decodedToken.id;
        req.isSignedIn = true;
        req.email = req.user.email;
        console.log("------------------------", req.email);

        next();
      }
    });
  } else {
    req.isSignedIn = false;
    next();
  }
};

//coupon authentication
const couponAuth = (req, res, next) => {
  var cookies = parseCookies(req);
  console.log(cookies.jwt);

  const token = cookies.coupon;

  //check if json webtoken exist and is valid
  if (token) {
    jwt.verify(token, "couponStringSecret", (err, decodedToken) => {
      if (err) {
        console.log(err);
        next();
      } else {
        console.log("jwt coupon ", decodedToken);
        res.locals.coupon = decodedToken;
        next();
      }
    });
  } else {
    next();
  }
};

//get cookies from headers and put them in headerrs
function parseCookies(request) {
  var list = {},
    rc = request.headers.cookie;

  rc &&
    rc.split(";").forEach(function (cookie) {
      var parts = cookie.split("=");
      list[parts.shift().trim()] = decodeURI(parts.join("="));
    });

  return list;
}
module.exports = { requireAuth, checkCurrentUser, couponAuth };
