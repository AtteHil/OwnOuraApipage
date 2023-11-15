// sends users personal access token to server side and server responds with user data as json object
const fetchApiData =()=>{
    const token = document.getElementById('PersonalToken').value
    fetch(`http://localhost:3000/OuraData/${token}`)
    .then(response => {
        if (!response.ok) {
            console.error("There was error while fetching");
        }
        return response.json(); 
        })
        .then(data =>{
            console.log(data.age);
            PersonalInfoDiv(data);

        })

}

// Function to build ther information div of the fetched user data
const PersonalInfoDiv=(data)=>{
    const parentDiv = document.getElementById('personalInfo');
    parentDiv.innerHTML = `
    <p>Age: ${data.age} years</p>
    <p>Weight: ${data.weight} kg</p>
    <p>Height: ${data.height} m</p>
    <p>Sex: ${data.biological_sex}</p>
    <p>Email: ${data.email}</p>`;

}