
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
const getDataforDates = async (wantedData, divName= null) => { // function to get dates and call backend with dates to find from database wanted days scores and show them 
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const database = wantedData; // input to know from which database we are finding data from
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        try {
          const response = await fetch(`/OuraData/databasedata/${database}/${startDate}/${endDate}`); // fetch the wanted data in given range
    
          if (response.status === 403) {
            window.alert("you need to input token first");
            throw new Error("No token is given");
          } else if (!response.ok) {
            throw new Error("There was an error while fetching");
          }
    
          const data = await response.json();
    
          if (divName == null) { // if called without div name from chart.js we only make keyvalue pairs of the days and scores and return those
            
            const result = convertToKeyValuePair(data)
            // console.log(result);
            return result;
          } else {
            showData(data, divName);
          }
        } catch (error) {
          console.error("An error occurred:", error.message);
          
        }
      } else {
        alert('Please select both start and end dates.');
      }
    };
const convertToKeyValuePair = (data) =>{ // convert data.day and data.score to key value pairs for easier use in the chart.js
    let result = {}
    for( let i in data){
        
        result[data[i][0].day] = data[i][0].score;
    }
    return result;
}
