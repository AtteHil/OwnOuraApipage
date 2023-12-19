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
const showData = (array, divName) => {
    const parentDiv = document.getElementById(divName);

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