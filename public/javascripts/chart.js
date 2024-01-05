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

const makeChart = async (scores) =>{ // make chart with chartjs
  const chartText = document.getElementById("chartText");
  chartText.innerHTML = "scores of selected range. Value 0 means that there is no data for that given day";
  const labels = Object.keys(scores);
  const ctx = document.getElementById('chart').getContext("2d");
  
  if (window.myChart) {
      // If it exists, destroy the chart
      window.myChart.destroy();
    }
  const activityData = labels.map(date => scores[date].activity);
  const sleepData = labels.map(date => scores[date].sleep);
  const readinessData = labels.map(date => scores[date].readiness);
  const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Activity',
          data: activityData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false,
        },
        {
          label: 'Sleep',
          data: sleepData,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          fill: false,
        },
        {
          label: 'Readiness',
          data: readinessData,
          backgroundColor: 'rgba(255, 255, 0, 0.2)',
          borderColor: 'rgba(255, 255, 0, 1)',
          borderWidth: 1,
          fill: false,
        },
      ],
    };
    window.myChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false, 
      
      plugins: {
          legend: {
              labels: {
                color: "green", 
                
                font: {
                  size: 14 
                }
              }
            }
      },
    
    scales: { // set label colors and font sizes
      y: {  
        ticks: {
          color: "green", 
          
          font: {
            size: 12, 
          },
          stepSize: 1,
        }
      },
      x: {  
          ticks: {
            color: "green",  
            
            font: {
              size: 10 
            }
            }}
  }
  }
  });
    
}
const getSelectedRange = async () => {
    const activity = await (getDataforDates('activity')); // activity has data even if ring has not been on it calculates the acitivty with last data oura has gotten
    if(!activity){
        return -1;
    }
    const sleep = await getDataforDates('sleep');         // found this with my own testing and therefore can loop throught the data byt going through activity and check if other scores have data of that day
    const readiness = await getDataforDates('readiness');
    
    const scores =getScores(sleep,activity,readiness);
    
    makeChart(scores);
}


const getScores = (sleep, activity, readiness) => { // make score object that has single day and all that days scores to it. if score is not found it defaults to 0.
    let scoreObj = {}
    for (i in activity){
        const sleepScore = sleep[i] || 0;
        const activityScore = activity[i];
        const readinessScore = readiness[i] || 0;
        scoreObj[i] = {sleep: sleepScore, activity: activityScore, readiness: readinessScore};
        
        }
    return scoreObj;
    
}
