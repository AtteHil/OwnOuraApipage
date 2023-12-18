// sends users personal access token to server side and server responds with user data as json object
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
                PersonalInfoDiv(data.information);
                ringInfoDiv(data.ringInformation);
                fetchSleepData();
                fetchActivityData();
                fetchReadinessData();
            }


        })


}
// const pLine = (category, data, unit = "") => {
//     return `<p><span style="color: rgba(4, 241, 36, 0.4); font-weight: bold;" >${category}</span> ${data} ${unit}</p>`
// }
// Function to build ther information div of the fetched user data
const PersonalInfoDiv = (data) => {
    const parentDiv = document.getElementById('personalInfo');
    const p = document.createElement('p');
    p.setAttribute("class", "infoText");
    p.innerHTML = `
    <h1>Your information</h1>
    ${pLine("Age:", data.age, "years")}
    ${pLine("Weight:", data.weight, "kg")}
    ${pLine("Height:", data.height, "m")}
    ${pLine("Sex:", data.biological_sex)}
    ${pLine("Email:", data.email)}`;
    parentDiv.appendChild(p);
    parentDiv.style.display = true ? 'block' : 'none';


}
// function to build ring information div
const ringInfoDiv = (data) => {
    const parentDiv = document.getElementById('ringInfo');
    const p = document.createElement('p');
    p.setAttribute("class", "infoText");
    p.innerHTML = `
    <h1>Ring information</h1>
    ${pLine("Color:", data.color)}
    ${pLine("Design:", data.design)}
    ${pLine("Firmware version:", data.firmware_version)}
    ${pLine("Hardware type:", data.hardware_type)}
    ${pLine("Size:", data.size)}`;
    parentDiv.appendChild(p);
    parentDiv.style.display = true ? 'block' : 'none';

}


const onLoad = () => {
    fetch('/user')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                console.log('User is logged in!', data.personalToken);
                fetchApiData(true, data.personalToken);
            } else {
                console.log('User is not logged in');
                return;
            }
        })
        .catch(error => console.error('Error:', error));
}

onLoad();