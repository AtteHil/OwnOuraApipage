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
    return `<p><span style="color: rgba(4, 241, 36, 0.4); font-weight: bold;" >${category}</span> ${data} ${unit}</p>`
}