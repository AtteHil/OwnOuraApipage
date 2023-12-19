
// functions to get data to database from oura api
const fetchSleepData = () => {
    fetch(`/OuraData/sleep`)
        .then(response => {
            if (!response.ok) {
                console.error("There was an error while fetching");
            }
            return response.json();
        })
        .then(data => {
            console.log("sleep added to db");
        });
};

const fetchActivityData = () => {
    fetch(`/OuraData/activity`)
        .then(response => {
            if (!response.ok) {
                console.error("There was an error while fetching");
            }
            return response.json();
        })
        .then(data => {
            console.log("activity added to db");
        });
};

const fetchReadinessData = () => {
    fetch(`/OuraData/readiness`)
        .then(response => {
            if (!response.ok) {
                console.error("There was an error while fetching");
            }
            return response.json();
        })
        .then(data => {
            console.log("readiness added to db");
        });
};
const pLine = (category, data, unit = "") => {
    return `<p><span style="color: #00b800; font-weight: bold;" >${category}</span> ${data} ${unit}</p>`
}
const readContributors = (contributorsJson) => {
    let htmlElement = ``
    for (i in contributorsJson) {
        htmlElement = htmlElement + pLine(i, contributorsJson[i]);
    }
    // console.log(htmlElement);
    return htmlElement
};
const showData = (array, divName) => { // function to show data from database in divs on different pages(sleep, activity and readiness)
    const parentDiv = document.getElementById(divName);
    parentDiv.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const data = array[i][0]
        const element = document.createElement('p');
        const nightbox = document.createElement("div");
        nightbox.setAttribute("class", "night");
        element.setAttribute("class", "nightText");
        const daySpan = document.createElement("span");
        daySpan.style.textDecoration = "underline";
        daySpan.style.textDecorationColor = "#0f8f0f";
        daySpan.textContent = data.day;
        element.innerHTML = `
        <h1>${daySpan.outerHTML}</h1>
        ${pLine("Score:", data.score)}
        ${readContributors(data.contributors)}`;
        nightbox.appendChild(element)
        parentDiv.appendChild(nightbox);


    }
}
const getDataforDates = async (wantedData, divName) => { // function to get dates and call backend with dates to find from database wanted days scores and show them 
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const database = wantedData; // input to know from which database we are finding data from
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) { // check that dates are valid dates 


        fetch(`/OuraData/databasedata/${database}/${startDate}/${endDate}`)
            .then(response => {
                if (response.status == 403) {
                    return alert("no token is given")
                }
                else if (!response.ok) {
                    console.error("There was error while fetching");
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    showData(data, divName);
                }

            })
    } else {
        alert('Please select both start and end dates.');
    }
}