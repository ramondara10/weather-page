var userSearches = [];
var mode;
var lat, lon;
var searchClick = 0;

userLocation()
// this detects if it can get the user's coords and plugs them in
function userLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            console.log("current position: ", lat, lon);
            searchStorage();
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat +
                "&lon=" + lon + "&units=imperial&appid=e2764fa35ac1bea55468905c58d7b4cb"

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log("response from geolocation coords ", response)

                var currentForcast = $("#today")
                // var btnHolder = $("#btn-holder")
                var fiveDay = $("#five-day")

                console.log("your response: ", response)
                var city = response.name;
                var temp = response.main.temp.toFixed(0);
                var humid = response.main.humidity;
                var wind = response.wind.speed;
                var timestamp = response.dt;
                var icon = response.weather[0].icon;
                var country = response.sys.country;

                console.log("your icon is ", icon)
                if (icon === "11d" || icon === "10d" || icon === "09d" || icon === "11n" || icon === "10n" || icon === "09n") {
                    mode = "rain";
                    $("body").attr("style", "background-image: linear-gradient(#000, #ccc);")
                    $(".container").attr("style", "background: #000;")
                }

                if (icon === "13d" || icon === "13n") {
                    mode = "snow";
                    $("body").attr("style", "background-image: linear-gradient(#32414e, #ccc);")
                    $(".container").attr("style", "background: #32414e;")
                }

                if (icon === "01d") {
                    mode = "clear day";
                    $("body").attr("style", "background-image: linear-gradient(#f6f897, #61aaee);")
                    $(".container").attr("style", "background: #61aaee;")
                }

                if (icon === "01n") {
                    mode = "clear night";
                    $("body").attr("style", "background-image: linear-gradient(#071725, #4600eb);")
                    $(".container").attr("style", "background: #071725;")
                }

                if (icon === "50d" || icon === "05n") {
                    mode = "atmosphere";
                    $("body").attr("style", "background-image: linear-gradient(#556675, #ccc);")
                    $(".container").attr("style", "background: #556675;")
                }

                if (icon === "02n" || icon === "02d" || icon === "03n" || icon === "03d" || icon === "04n" || icon === "04d") {
                    mode = "clouds";
                    $("body").attr("style", "background-image: linear-gradient(#071725, #4600eb);")
                    $(".container").attr("style", "background: #071725;")
                }

                var queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=e2764fa35ac1bea55468905c58d7b4cb&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (response) {
                    // console.log(response)
                    var date = new Date(timestamp * 1000);
                    var year = date.getFullYear();
                    var month = date.getMonth();
                    month = month + 1; //why is this wrong and needing a + 1? who knows! I don't have time to figure it out
                    var day = date.getDate();
                    var dateFormat = month + "/" + day + "/" + year
                    var uvIndex = response.value
                    console.log("month ", month)

                    // actually the date stuff is all pretty iffy but again I just don't have time to figure out what tiny little mistake is messing it all up right now


                    console.log(day)

                    currentForcast.html("<span><h1>Today's Forcast</h1></span><span><img style='dispaly: inline' src='https://openweathermap.org/img/wn/" + icon + "@2x.png'><h2>"
                        + city + " " + dateFormat +
                        "</h2></span><span><h3>Temperature: " + temp +
                        "&deg;</h3></span><span><h3>Humidity: " + humid +
                        "%</h3></span><span><h3>Wind Speed: " + wind +
                        " mph</h3></span><span><h3>UV Index: <span style='color: #fff; background: red; border-radius: 10px; padding: 0 5px 0 5px;'>" + uvIndex +
                        "</span></h3></span>");

                    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "," + country + "&units=imperial&appid=e2764fa35ac1bea55468905c58d7b4cb&lat"

                    $.ajax({
                        url: queryURL,
                        method: "GET"
                    }).then(function (response) {
                        console.log("five day forcast response: ", response);
                        // fiveDay.html("<div class='twelve columns'><span><h1>5-Day Forcast</h1></span>");
                        // $("<div id='five-forcast' class='row'>").insertAfter("#five-day");)
                        for (var i = 0; i < 31; i++) {
                            if ([1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29].indexOf(i) === -1) {

                                var fiveDate = new Date(response.list[i].dt * 1000)
                                var weekArr = ["Mon", "Teus", "Wed", "Thr", "Fri", "Sat", "Sun"]
                                var weekday = weekArr[fiveDate.getDay()];
                                var day = fiveDate.getDate();
                                day = day + 1;
                                var month = fiveDate.getMonth();
                                month = month + 1;
                                var year = fiveDate.getFullYear();
                                var dateFormat = weekday + " - " + month + "/" + day + "/" + year

                                var fiveDayForcast = {
                                    day: "<span><h4>" + dateFormat + "</h4></span>",
                                    temp: "<span><h5>Temp: " + response.list[i].main.temp.toFixed(0) + "&deg;</h5></span>",
                                    humidity: "<span><h5>Humidity: " + response.list[i].main.humidity + "%</h5></span>",
                                    icon: "<span><img src='https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png'></span>"
                                }

                                var newCol = $("<div class='two columns'>");

                                fiveDay.append(newCol);
                                newCol.html(fiveDayForcast.icon + fiveDayForcast.day + fiveDayForcast.temp + fiveDayForcast.humidity)
                            }
                        }
                        document.querySelector(".two").className = "two columns offset-by-one";
                    })
                })
            })
        })
    }
    else {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Paris,France&units=imperial&appid=e2764fa35ac1bea55468905c58d7b4cb"

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var currentForcast = $("#today")
            var btnHolder = $("#btn-holder")
            var fiveDay = $("#five-day")

            // currentForcast.empty();
            // $("#five-forcast").empty();
            fiveDay.empty();
            btnHolder.empty();


            userSearches.push(userSearch.split(',')[0])
            console.log("user searches array ", userSearches)
            currentForcast.html("<span><h1>Today's Forcast</h1></span>")
            btnHolder.html("<span><h1>Past Searches</h1></span>")


            for (var i = 0; i < userSearches.length; i++) {
                var buttonEl = $("<button data-city='" + userSearch + "' class='past-btn'>");
                buttonEl.text(userSearches[i]);
                buttonEl.attr("style", "margin: 10px;")
                btnHolder.append(buttonEl);
            }

            searchStorage();

            console.log("your response: ", response)
            var city = response.name;
            var temp = response.main.temp.toFixed(0);
            var humid = response.main.humidity;
            var wind = response.wind.speed;
            var timestamp = response.dt;
            var icon = response.weather[0].icon;
            var country = response.sys.country;

            if (icon === "11d" || icon === "10d" || icon === "09d" || icon === "11n" || icon === "10n" || icon === "09n") {
                mode = "rain";
                $("body").attr("style", "background-image: linear-gradient(#000, #ccc);")
                $(".container").attr("style", "background: #000;")
            }

            if (icon === "13d" || icon === "13n") {
                mode = "snow";
                $("body").attr("style", "background-image: linear-gradient(#32414e, #ccc);")
                $(".container").attr("style", "background: #32414e;")
            }

            if (icon === "01d") {
                mode = "clear day";
                $("body").attr("style", "background-image: linear-gradient(#f6f897, #61aaee);")
                $(".container").attr("style", "background: #61aaee;")
            }

            if (icon === "01n") {
                mode = "clear night";
                $("body").attr("style", "background-image: linear-gradient(#071725, #4600eb);")
                $(".container").attr("style", "background: #071725;")
            }

            if (icon === "50d" || icon === "05n") {
                mode = "atmosphere";
                $("body").attr("style", "background-image: linear-gradient(#556675, #ccc);")
                $(".container").attr("style", "background: #556675;")
            }

            if (icon === "02n" || icon === "02d" || icon === "03n" || icon === "03d" || icon === "04n" || icon === "04d") {
                mode = "clouds";
                $("body").attr("style", "background-image: linear-gradient(#071725, #4600eb);")
                $(".container").attr("style", "background: #071725;")
            }

            var queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=e2764fa35ac1bea55468905c58d7b4cb&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response)
                var date = new Date(timestamp * 1000);
                var year = date.getFullYear();
                var month = date.getMonth();
                month = month + 1;
                var day = date.getDate();
                var dateFormat = month + "/" + day + "/" + year
                var uvIndex = response.value


                console.log(day)

                currentForcast.html("<span><h1>Today's Forcast</h1></span><span><img src='https://openweathermap.org/img/wn/" + icon + "@2x.png'><h2>"
                    + city + " " + dateFormat +
                    "</h2></span><span><h3>Temperature: " + temp +
                    "&deg;</h3></span><span><h3>Humidity: " + humid +
                    "%</h3></span><span><h3>Wind Speed: " + wind +
                    " mph</h3></span><span><h3>UV Index: <span style='color: #fff; background: red; border-radius: 10px; padding: 0 5px 0 5px;'>" + uvIndex +
                    "</span></h3></span>");

                var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "," + country + "&units=imperial&appid=e2764fa35ac1bea55468905c58d7b4cb&lat"

                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (response) {
                    console.log("five day forcast response: ", response)
                    for (var i = 0; i < 31; i++) {
                        if ([1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29].indexOf(i) === -1) {

                            var fiveDate = new Date(response.list[i].dt * 1000)
                            var weekArr = ["Mon", "Teus", "Wed", "Thr", "Fri", "Sat", "Sun"]
                            var weekday = weekArr[fiveDate.getDay()];
                            var day = fiveDate.getDate();
                            day = day + 1;
                            var month = fiveDate.getMonth();
                            month = month + 1;
                            var year = fiveDate.getFullYear();
                            var dateFormat = weekday + " - " + month + "/" + day + "/" + year

                            var fiveDayForcast = {
                                day: "<span><h4>" + dateFormat + "</h4></span>",
                                temp: "<span><h5>Temp: " + response.list[i].main.temp.toFixed(0) + "&deg;</h5></span>",
                                humidity: "<span><h5>Humidity: " + response.list[i].main.humidity + "%</h5></span>",
                                icon: "<span><img src='https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png'></span>"
                            }

                            var newCol = $("<div class='two columns'>");

                            fiveDay.append(newCol);
                            newCol.html(fiveDayForcast.icon + fiveDayForcast.day + fiveDayForcast.temp + fiveDayForcast.humidity)
                        }
                    }
                    document.querySelector(".two").className = "two columns offset-by-one";
                })
            })
        })
    }
}



function getResponse(event) {
    searchClick++;
    event.preventDefault();
    console.log("click number: ", searchClick)
    var userSearch = $("#user-search").val();

    var storeCity = userSearch.split(',')[0]
    console.log("does storeCity work? ", storeCity)
    userSearch = userSearch.replace(/\s+/g, '')
    if (userSearch === "") {
        return;
    }
    else {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userSearch + "&units=imperial&appid=e2764fa35ac1bea55468905c58d7b4cb";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var currentForcast = $("#today")
            var btnHolder = $("#btn-holder")
            var fiveDay = $("#five-day")

            // currentForcast.empty();
            // $("#five-forcast").empty();
            fiveDay.empty();
            btnHolder.empty();


            userSearches.push(userSearch.split(',')[0])
            console.log("user searches array ", userSearches)
            currentForcast.html("<span><h1>Today's Forcast</h1></span>")
            btnHolder.html("<span><h1>Past Searches</h1></span>")


            for (var i = 0; i < userSearches.length; i++) {
                var buttonEl = $("<button data-city='" + userSearch + "' class='past-btn'>");
                buttonEl.text(userSearches[i]);
                buttonEl.attr("style", "margin: 10px;")
                btnHolder.append(buttonEl);
            }

            searchStorage();

            console.log("your response: ", response)
            var city = response.name;
            var temp = response.main.temp.toFixed(0);
            var humid = response.main.humidity;
            var wind = response.wind.speed;
            var timestamp = response.dt;
            var icon = response.weather[0].icon;
            var country = response.sys.country;

            if (icon === "11d" || icon === "10d" || icon === "09d" || icon === "11n" || icon === "10n" || icon === "09n") {
                mode = "rain";
                $("body").attr("style", "background-image: linear-gradient(#000, #ccc);")
                $(".container").attr("style", "background: #000;")
            }

            if (icon === "13d" || icon === "13n") {
                mode = "snow";
                $("body").attr("style", "background-image: linear-gradient(#32414e, #ccc);")
                $(".container").attr("style", "background: #32414e;")
            }

            if (icon === "01d") {
                mode = "clear day";
                $("body").attr("style", "background-image: linear-gradient(#f6f897, #61aaee);")
                $(".container").attr("style", "background: #61aaee;")
            }

            if (icon === "01n") {
                mode = "clear night";
                $("body").attr("style", "background-image: linear-gradient(#071725, #4600eb);")
                $(".container").attr("style", "background: #071725;")
            }

            if (icon === "50d" || icon === "05n") {
                mode = "atmosphere";
                $("body").attr("style", "background-image: linear-gradient(#556675, #ccc);")
                $(".container").attr("style", "background: #556675;")
            }

            if (icon === "02n" || icon === "02d" || icon === "03n" || icon === "03d" || icon === "04n" || icon === "04d") {
                mode = "clouds";
                $("body").attr("style", "background-image: linear-gradient(#071725, #4600eb);")
                $(".container").attr("style", "background: #071725;")
            }

            var queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=e2764fa35ac1bea55468905c58d7b4cb&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response)
                var date = new Date(timestamp * 1000);
                var year = date.getFullYear();
                var month = date.getMonth();
                month = month + 1;
                var day = date.getDate();
                var dateFormat = month + "/" + day + "/" + year
                var uvIndex = response.value


                console.log(day)

                currentForcast.html("<span><h1>Today's Forcast</h1></span><span><img src='https://openweathermap.org/img/wn/" + icon + "@2x.png'><h2>"
                    + city + " " + dateFormat +
                    "</h2></span><span><h3>Temperature: " + temp +
                    "&deg;</h3></span><span><h3>Humidity: " + humid +
                    "%</h3></span><span><h3>Wind Speed: " + wind +
                    " mph</h3></span><span><h3>UV Index: <span style='color: #fff; background: red; border-radius: 10px; padding: 0 5px 0 5px;'>" + uvIndex +
                    "</span></h3></span>");

                var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "," + country + "&units=imperial&appid=e2764fa35ac1bea55468905c58d7b4cb&lat"

                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (response) {
                    console.log("five day forcast response: ", response)
                    for (var i = 0; i < 31; i++) {
                        if ([1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29].indexOf(i) === -1) {

                            var fiveDate = new Date(response.list[i].dt * 1000)
                            var weekArr = ["Mon", "Teus", "Wed", "Thr", "Fri", "Sat", "Sun"]
                            var weekday = weekArr[fiveDate.getDay()];
                            var day = fiveDate.getDate();
                            day = day + 1;
                            var month = fiveDate.getMonth();
                            month = month + 1;
                            var year = fiveDate.getFullYear();
                            var dateFormat = weekday + " - " + month + "/" + day + "/" + year

                            var fiveDayForcast = {
                                day: "<span><h4>" + dateFormat + "</h4></span>",
                                temp: "<span><h5>Temp: " + response.list[i].main.temp.toFixed(0) + "&deg;</h5></span>",
                                humidity: "<span><h5>Humidity: " + response.list[i].main.humidity + "%</h5></span>",
                                icon: "<span><img src='https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png'></span>"
                            }

                            var newCol = $("<div class='two columns'>");

                            fiveDay.append(newCol);
                            newCol.html(fiveDayForcast.icon + fiveDayForcast.day + fiveDayForcast.temp + fiveDayForcast.humidity)
                        }
                    }
                    document.querySelector(".two").className = "two columns offset-by-one";
                    if (searchClick > 7) {
                        searchClick = 0;
                    }

                    var storageSlots = [1, 2, 3, 4, 5, 6, 7];
                    localStorage.setItem(storageSlots[searchClick], userSearch);
                })
            })
        })
    }
}

function getBtnResponse(event) {
    event.preventDefault();
    event.stopPropagation();
    searchStorage();
    console.log("click number: ", searchClick)
    var userSearch = $(this).attr("data-city");
    console.log("data-city?", userSearch)

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userSearch + "&units=imperial&appid=e2764fa35ac1bea55468905c58d7b4cb";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var currentForcast = $("#today")
        var btnHolder = $("#btn-holder")
        var fiveDay = $("#five-day")

        // currentForcast.empty();
        // $("#five-forcast").empty();
        fiveDay.empty();
        btnHolder.empty();


        userSearches.push(userSearch.split(',')[0])
        console.log("user searches array ", userSearches)
        currentForcast.html("<span><h1>Today's Forcast</h1></span>")
        btnHolder.html("<span><h1>Past Searches</h1></span>")

    
        for (var i = 0; i < userSearches.length; i++) {
            var buttonEl = $("<button data-city='" + userSearches + "' class='past-btn'>");
            buttonEl.text(userSearches[i]);
            buttonEl.attr("style", "margin: 10px;")
            btnHolder.append(buttonEl);
        }

        searchStorage();

        console.log("your response: ", response)
        var city = response.name;
        var temp = response.main.temp.toFixed(0);
        var humid = response.main.humidity;
        var wind = response.wind.speed;
        var timestamp = response.dt;
        var icon = response.weather[0].icon;
        var country = response.sys.country;

        if (icon === "11d" || icon === "10d" || icon === "09d" || icon === "11n" || icon === "10n" || icon === "09n") {
            mode = "rain";
            $("body").attr("style", "background-image: linear-gradient(#000, #ccc);")
            $(".container").attr("style", "background: #000;")
        }

        if (icon === "13d" || icon === "13n") {
            mode = "snow";
            $("body").attr("style", "background-image: linear-gradient(#32414e, #ccc);")
            $(".container").attr("style", "background: #32414e;")
        }

        if (icon === "01d") {
            mode = "clear day";
            $("body").attr("style", "background-image: linear-gradient(#f6f897, #61aaee);")
            $(".container").attr("style", "background: #61aaee;")
        }

        if (icon === "01n") {
            mode = "clear night";
            $("body").attr("style", "background-image: linear-gradient(#071725, #4600eb);")
            $(".container").attr("style", "background: #071725;")
        }

        if (icon === "50d" || icon === "05n") {
            mode = "atmosphere";
            $("body").attr("style", "background-image: linear-gradient(#556675, #ccc);")
            $(".container").attr("style", "background: #556675;")
        }

        if (icon === "02n" || icon === "02d" || icon === "03n" || icon === "03d" || icon === "04n" || icon === "04d") {
            mode = "clouds";
            $("body").attr("style", "background-image: linear-gradient(#071725, #4600eb);")
            $(".container").attr("style", "background: #071725;")
        }

        var queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=e2764fa35ac1bea55468905c58d7b4cb&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            var date = new Date(timestamp * 1000);
            var year = date.getFullYear();
            var month = date.getMonth();
            month = month + 1;
            var day = date.getDate();
            var dateFormat = month + "/" + day + "/" + year
            var uvIndex = response.value


            console.log(day)

            currentForcast.html("<span><h1>Today's Forcast</h1></span><span><img src='https://openweathermap.org/img/wn/" + icon + "@2x.png'><h2>"
                + city + " " + dateFormat +
                "</h2></span><span><h3>Temperature: " + temp +
                "&deg;</h3></span><span><h3>Humidity: " + humid +
                "%</h3></span><span><h3>Wind Speed: " + wind +
                " mph</h3></span><span><h3>UV Index: <span style='color: #fff; background: red; border-radius: 10px; padding: 0 5px 0 5px;'>" + uvIndex +
                "</span></h3></span>");

            var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "," + country + "&units=imperial&appid=e2764fa35ac1bea55468905c58d7b4cb&lat"

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log("five day forcast response: ", response)
                for (var i = 0; i < 31; i++) {
                    if ([1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29].indexOf(i) === -1) {

                        var fiveDate = new Date(response.list[i].dt * 1000)
                        var weekArr = ["Mon", "Teus", "Wed", "Thr", "Fri", "Sat", "Sun"]
                        var weekday = weekArr[fiveDate.getDay()];
                        var day = fiveDate.getDate();
                        day = day + 1;
                        var month = fiveDate.getMonth();
                        month = month + 1;
                        var year = fiveDate.getFullYear();
                        var dateFormat = weekday + " - " + month + "/" + day + "/" + year

                        var fiveDayForcast = {
                            day: "<span><h4>" + dateFormat + "</h4></span>",
                            temp: "<span><h5>Temp: " + response.list[i].main.temp.toFixed(0) + "&deg;</h5></span>",
                            humidity: "<span><h5>Humidity: " + response.list[i].main.humidity + "%</h5></span>",
                            icon: "<span><img src='https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png'></span>"
                        }

                        var newCol = $("<div class='two columns'>");

                        fiveDay.append(newCol);
                        newCol.html(fiveDayForcast.icon + fiveDayForcast.day + fiveDayForcast.temp + fiveDayForcast.humidity)
                    }
                }
                document.querySelector(".two").className = "two columns offset-by-one";
                if (searchClick > 6) {
                    searchClick = 0;
                }

                var storageSlots = [0, 1, 2, 3, 4, 5, 6];
                localStorage.setItem(storageSlots[searchClick], userSearch);
            })
        })
    })
}

function searchStorage() {
    var storageSlot = [localStorage.getItem("1"), localStorage.getItem("2"), localStorage.getItem("3"), localStorage.getItem("4"), localStorage.getItem("5"), localStorage.getItem("6"), localStorage.getItem("7")]

    console.log("storage slot array ", storageSlot)
    if (storageSlot[0] === null && storageSlot[1] === null && storageSlot[2] === null && storageSlot[3] === null && storageSlot[4] === null && storageSlot[5] === null && storageSlot[6] === null) {
        return;
    }
    else {
        var filtered = storageSlot.filter(function (el) {
            return el != null;
        });
        console.log("filtered", filtered)
        $("#btn-holder").html("<span><h1>Past Searches</h1></span>")
        for (var i = 0; i < filtered.length; i++) {
            var buttonEl = $("<button data-city='" + storageSlot[i] + "' value='submit'>");
            buttonEl.text(filtered[i].split(',')[0]);
            buttonEl.attr("style", "margin: 10px;");
            buttonEl.attr("class", "past-btn");
            $("#btn-holder").append(buttonEl);
        }
    }
}

$("#search-btn").on("click", getResponse)
$(document).on("click", ".past-btn", getBtnResponse)