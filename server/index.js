const axios = require('axios');
const cheerio = require('cheerio');

const express = require("express");
const cors = require("cors");

var app = express();
app.use(cors());
app.options('*', cors());

const port = process.env.PORT || 3000;

var allowed_origins = ['http://localhost:8080'];

app.listen(port, () => console.log("Server running on port " + port));

app.use(cors({
	origin: function(origin, callback) {
		console.log({origin});
		if (!origin) return callback(null, true);

		if (allowed_origins.indexOf(origin) === -1) {
			var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
			return callback(new Error(msg), false);
	  	}
		return callback(null, true);
	}
  }));

app.get("/getTimes/:query", (req, res, next) => {
	var query = req.params.query;
	if (!query) res.send("Please provide a search query")
	console.log("New request for:", query);
	const PERRON = "1";

	axios("https://9292.nl/rotterdam/" + query)
		.then((response, i) => {
			const $ = cheerio.load(response.data);
			const departures = $(".departures table tbody tr").filter((i, d) => {
				const departure_perron = $(d).find("td[data-label='Perron'] span").text().trim();
				return departure_perron === "Perron " + PERRON;
			})
			const formatted_departures = [];
			$(departures).each((i, d) => {
				const $time = $(d).find("td[data-label='Tijd']");
				const $former_time = $time.find("del");
				const $new_time = $time.find(".orangetxt");

				const former_time = $former_time.length ? $former_time.text().trim() : null;
				const new_time = $new_time.length ? $new_time.text().trim() : null;
				const normal_time = former_time || new_time ? null : $time.text().trim();

				formatted_departures.push({ normal_time, former_time, new_time });
			})
			console.log(formatted_departures);
			res.send(formatted_departures)
		});
});