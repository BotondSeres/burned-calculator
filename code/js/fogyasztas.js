import {getFromLocalStorage, getMaxIDFromLocalStorage} from "./localStorage.js"
import { CalculateBMR, CalculateWorkingDailyEnergyExpenditure, metEnergyExpenditure } from "./calculations.js";


// #region Get Data
const profileData = getFromLocalStorage("profileData", "json");
let activities = [];
function getActivityData(){
    let maxID = getMaxIDFromLocalStorage("activity")
    if(maxID === 0){
        alert("Nincs még mára rögzítve mozgás!")
        window.location.href = "./napisport.html"
        return false;
    }
    for(let i = 1; i <= maxID; i++){
        const activity = getFromLocalStorage(`activity[${i}]`, "json");
        if(activity != null){
            activities.push(activity);
        }
    }
    return true;
}
//#endregion

// Breadcrumb modal evenlistener
const breadcrumbModal = document.getElementById("brModal");
const modal = document.getElementById('alapAdatokModal');
breadcrumbModal.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('is-active');
});


// #region Chart data gethering
let chartLabels = [];
let chartData = [];
function getChartData(activities, profileData){
    // Nyugalmi Anyagcsere
    chartLabels.push("Nyugalmi Anyagcsere");
    const RMR = CalculateBMR(profileData.sex, profileData.height, profileData.weight, profileData.age);
    chartData.push(parseInt(RMR));
    // Munkahelyi Aktivitas
    chartLabels.push("Munkahelyi Aktivitás");
    const munkahelyiAktivitias = CalculateWorkingDailyEnergyExpenditure(RMR, profileData.workplaceActivity) - RMR;
    chartData.push(parseInt(munkahelyiAktivitias.toFixed(0)));
    activities.forEach(element => {
        chartLabels.push(element.activity)
        const EE = parseInt(metEnergyExpenditure(element.durationM, element.met, profileData.weight));
        chartData.push(EE);
    });
    console.log(chartLabels);
    console.log(chartData);
};
// #endregion

function generateColors(n) {
    let colors = [];
    for (let i = 0; i < n; i++) {
        const hue = (i * 37) % 360;           // szétszórt HSL színek
        colors.push(`hsl(${hue}, 70%, 55%)`);
    }
  return colors;
}


document.addEventListener("DOMContentLoaded", e =>{
    getActivityData();
    getChartData(activities, profileData);
    let TEE = 0;
    chartData.map(e => TEE += e);
    const totalCal = document.getElementById("totalCal");
    totalCal.innerText = `A mai nap elégetett kalória: ${TEE} Kcal`;
    let colors = generateColors(chartData.length)
    new Chart(document.getElementById("pie-chart"), {
        type: 'pie',
        data: {
          labels: chartLabels,
          datasets: [{
            label: "Fogyasztás (Kcal)",
            backgroundColor: colors,//["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
            data: chartData
          }]
        },
        options: {
            plugins: {
                legend: {
                display: true
                },
                tooltip: true
            }
        }
    });
});