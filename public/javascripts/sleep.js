
const fetchApiData = (loggedIn, token = "") => {
    if (!loggedIn) {
        token = document.getElementById('PersonalToken').value
        if (token.length != 32) {
            alert("Token should be 32 character long code");
            return;
        }
    }
    fetch(`http://localhost:3000/info/${token}`)
        .then(response => {
            if (!response.ok) {
                console.error("There was error while fetching");
            }
            return response.json();
        })
        .then(data => {
            if (!data.status) {
                fetchSleepData();
                fetchActivityData();
                fetchReadinessData();
            }


        })


}
const sleepContributors = (contributorsJson) => {
    let htmlElement = ``
    for (i in contributorsJson) {
        htmlElement = htmlElement + pLine(i, contributorsJson[i]);
    }
    // console.log(htmlElement);
    return htmlElement
};
const getSelectedRange = async () => {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (startDate && endDate) {
        console.log(`Selected Date Range: ${startDate} to ${endDate}`);
        fetch(`/OuraData/sleepscores/${startDate}/${endDate}`)
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
                console.log(data);
                showSleep(data);
            })
    } else {
        console.log('Please select both start and end dates.');
    }
}

const showSleep = (array) => {
    const parentDiv = document.getElementById("sleepInfo");

    for (let i = 0; i < array.length; i++) {
        const data = array[i][0]
        const element = document.createElement('p');
        const nightbox = document.createElement("div");
        nightbox.setAttribute("class", "night");
        element.setAttribute("class", "nightText")
        element.innerHTML = `
        <h1>Night ${data.day}</h1>
        ${pLine("Score:", data.score)}
        ${sleepContributors(data.contributors)}`;
        nightbox.appendChild(element)
        parentDiv.appendChild(nightbox);


    }
}




