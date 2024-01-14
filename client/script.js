fetch("https://get-ret-times.onrender.com/getTimes/metrostation-rijnhaven")
    .then((response) => response.json())
    .then((tijden) => {
        console.log("ooooi")
        console.log(tijden);
    })