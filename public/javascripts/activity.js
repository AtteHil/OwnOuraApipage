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
const getSelectedRange = async () => {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const database = 'activity';
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {

        console.log(`Selected Date Range: ${startDate} to ${endDate}`);
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
                console.log(data);
                showData(data, 'activityInfo');
            })
    } else {
        alert('Please select both start and end dates.');
    }
}