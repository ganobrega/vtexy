"use strict";

const express = require("express");
const request = require('request');


/**
 * @param 
 */
module.exports = function(storeName) {
    const app = express();

    const VTEX_HOST = `${storeName}.vtexcommercestable.com.br`;

    // app.use('/arquivos/*', express.static("public/arquivos"));
    
    // app.use('/files*', (req,res,next) => {
    //     express.static("public/files");
    // })

    app.use('*', (req,res,next)=> {
        let options = {
          url: 'https://' + VTEX_HOST + req.originalUrl,
          method: req.method,
          headers: {
              accept: req.headers.accept
            }
        };

        
        request(options, function(error, response, body) {
            console.log({options, error});
            
            if(error) return;

            res.contentType = response.contentType;
            res.body = response.body;
            res.statusCode = response.statusCode;
            // res.send();
            next()
        });
        
    })

    app.listen(8888, () => {
      console.log("Listening to 0.0.0.0:8888");
      console.log(`Proxyng: ${VTEX_HOST}`);
    });
};
