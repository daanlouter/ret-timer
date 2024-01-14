var wrapper = document.querySelector("#wrapper");
const limit = 8;

fetch("https://get-ret-times.onrender.com/getTimes/metrostation-rijnhaven")
	.then((response) => response.json())
	.then((tijden) => {
		const nu = new Date();
		const vandaag = {
			dag: nu.getDate(),
			maand: "0" + (nu.getMonth() + 1),
			jaar: nu.getFullYear()
		}
		wrapper.querySelector("main").innerHTML = "";
		tijden.forEach((t, i) => {
			if (i >= limit) return;
			const time = t.new_time || t.normal_time;
			const parsed_time = Date.parse(`${vandaag.jaar}-${vandaag.maand}-${vandaag.dag}T${time}:00`);
			const ETA = (parsed_time - nu) / 1000 / 60;

			const $el = document.createElement("div");
			const $tijd = document.createElement("div");
			const $eta = document.createElement("div");
			const $categorie = document.createElement("div");

			$el.classList.add("departure");
			$el.classList.add(getCategoryText(ETA).status);

			$tijd.innerText = time;
			$tijd.classList.add("vertrektijd");
			
			$eta.innerText = "Over " + Math.round(ETA) + " minuten";
			$eta.classList.add("eta");

			$categorie.innerText = getCategoryText(ETA).text;
			$categorie.classList.add("categorie");

			$el.appendChild($eta);
			$el.appendChild($categorie);
			$el.appendChild($tijd);

			wrapper.querySelector("main").appendChild($el);
		})
	})


function getCategoryText(eta) {
	const distance = 8;
	if (eta - distance < 0) return { status: "bad", text: "Ga je niet halen" };
	else if (eta - distance === 0) return { status: "bad", text: "Als je rent" };
	else if (eta - distance > 0 && eta - distance < 3) return { status: "good", text: "Goede tijd. 1-3 minuten wachten" };
	else if (eta - distance > 3 && eta - distance < 5) return { status: "okay", text: "Rustig aan. 3-5 minuten wachten" };
	else return { status: "bad", text: `> ${Math.round(eta - distance)} minuten wachten` };
}