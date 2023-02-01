var express = require('express');
var app = express();
var csv = require('fast-csv');
var fs = require('fs');

var home_url = "http://carapi.heroku.com";

app.use(express.static('public'));
app.set('view engine', 'jade');

app.get('/', function (req, res) {
    res.render('index', { title: 'Carapi', subtitle: 'All makes and models of vehicles for free for your projects.', message: 'We have 74 makes of vehicles until now'});
});

app.get('/api/make/:make', function(request, response) {

    var make = request.params.make;

    if (!(make > 0)){
        response.send('{"detail":"Not found."}'); // Return json with data
    }
    var jsonModels = new Array();

    var csvMakes = fs.createReadStream("./data/makes.csv");

    csv
    .fromStream(csvMakes, {headers : true})
    .validate(function(makes){

        return makes.id == make; // make with id url

    })
    .on("data", function(makes){

        // Defino contadores para ver en que momento debo hacer el "send"
        var ma = 0;
        var mo = 0;
        var csvModels = fs.createReadStream("./data/models.csv");

        csv
        .fromStream(csvModels, {headers : true})
        .validate(function(models){

            return models.idmake == make; //all models with id make

        })
        .on("data", function(models){

            ma++;
            var dataModels = new Object();
            var idmodel = models.id;
            dataModels.id = idmodel;
            dataModels.model = models.model;
            dataModels.url = home_url+"/api/model/"+idmodel;

            var csvYears = fs.createReadStream("./data/years_models.csv");
            var jsonYears = new Array();

            csv
            .fromStream(csvYears, {headers : true})
            .validate(function(years){

                return years.idmodel == idmodel; //all years with id make

            })
            .on("data", function(years){

                var data_years = new Object();
                data_years.year = years.year;
                data_years.url = home_url+"/api/year/"+years.year;
                jsonYears.push(data_years); // Add models to array

            })
            .on("end", function(){
                // End of years
                mo++;
                dataModels.versions = jsonYears;
                jsonModels.push(dataModels); // Add models to array
                //console.log("ready years!");
                makes.url = home_url+"/api/make/"+make;
                makes.models = jsonModels;

                if (mo == ma) {
                    response.send(makes); // Return json with data
                }

            });

        })
        .on("end", function(){
            // End of models
            //console.log("ready models!");

        });
    })
    .on("end", function(){
        // End of makes
        //console.log("ready makes!");
    });

});

app.get('/api/model/:model', function(request, response) {

    var model = request.params.model;

    if (!(model > 0)){
        response.send('{"detail":"Not found."}'); // Return json with data
    }

    var csvModels = fs.createReadStream("./data/models.csv");

    csv
    .fromStream(csvModels, {headers : true})
    .validate(function(models){

        return models.id == model; // model with id url

    })
    .on("data", function(models){

        var idmake = models.idmake;

        var csvMakes = fs.createReadStream("./data/makes.csv");

        csv
        .fromStream(csvMakes, {headers : true})
        .validate(function(makes){

            return makes.id == idmake; //all models with id make

        })
        .on("data", function(makes){

            models.make = makes.make;
            models.url = home_url+"/api/model/"+model;

            var csvYears = fs.createReadStream("./data/years_models.csv");
            var jsonYears = new Array();

            csv
            .fromStream(csvYears, {headers : true})
            .validate(function(years){

                return years.idmodel == model; //all years with id make

            })
            .on("data", function(years){

                var data_years = new Object();
                data_years.year = years.year;
                data_years.url = home_url+"/api/year/"+years.year;
                jsonYears.push(data_years); // Add models to array

            })
            .on("end", function(){
                // End of years
                models.year = jsonYears;
                response.send(models); // Return json with data

            });

        })
        .on("end", function(){
            // End of makes
            console.log("ready makes!");
        });


    })
    .on("end", function(){
        // End of models
        console.log("ready models!");
    });

});

var port = process.env.PORT || 3000;
app.listen(port);

// Render some console log output
console.log("Listening on port " + port);
