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
    await getDataforDates('readiness', 'readinessInfo');
}
