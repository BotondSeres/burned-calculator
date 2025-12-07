import {getFromLocalStorage} from "./localStorage.js"
import { GetBmi, CalculateIdealWeightHamwi, BmiToKg, CalculateBMR, CalculateWorkingDailyEnergyExpenditure } from "./calculations.js";


document.addEventListener("DOMContentLoaded", event =>{
    getProfileData();
    BMIOutput();
    HamwiOutput();
    idealWeightRangeOutput();
    KCalOutput();
});

//#region Szamitasok
let profileData = {};
const clickEvent = new Event("click")
function getProfileData(){
    profileData = getFromLocalStorage("profileData", "json");
    if(profileData === null){
        noProfileData();
    }else{
        console.log("Profile data loaded.")
    }
}
function noProfileData(){
    alert("Mielőtt továbblépnél meg kell adnod az alap adataid!")
    breadcrumbModal.dispatchEvent(clickEvent);
}
// BMI
const bmiOut = document.getElementById("bmiOutput");
function BMIOutput(){
    
    if(profileData != null && Object.keys(profileData).length > 0){
        const userBMI = GetBmi(profileData.height, profileData.weight);
        bmiOut.innerText = userBMI;
    }
}
// Hamwi
const hamwiOut = document.getElementById("hamwiOutput");
function HamwiOutput(){
    if (profileData != null && Object.keys(profileData).length >0){
        const userIdealWeight = `${CalculateIdealWeightHamwi(profileData.sex, profileData.height)} kg`;
        hamwiOut.innerText = userIdealWeight;
    }
}
// Ideal Weight Range
// Normal range bmi: 18.5-24.9
const idealWeightOut = document.getElementById("idealWeightOutput");
function idealWeightRangeOutput(){
    if (profileData != null && Object.keys(profileData).length >0){
        const userIdealWeightRange = `${BmiToKg(18.5, profileData.height)}-${BmiToKg(24.9, profileData.height)} kg`;
        idealWeightOut.innerText = userIdealWeightRange;
    }
}
// RMR
const rmrOut = document.getElementById("rmrOutput");
const minCalOut = document.getElementById("energyExpOutput");
function KCalOutput(){
    if (profileData != null && Object.keys(profileData).length >0){
        const userRMR = CalculateBMR(profileData.sex, profileData.height, profileData.weight, profileData.age);
        rmrOut.innerText = `${userRMR} Kcal`;
        const userEnergyExp = `${CalculateWorkingDailyEnergyExpenditure(userRMR, profileData.workplaceActivity)} Kcal`
        minCalOut.innerText = userEnergyExp;
    }
}


//#endregion

const navigationPrevious = document.getElementById("navigationProfile");
navigationPrevious.addEventListener("click", e =>{
    breadcrumbModal.dispatchEvent(clickEvent);
});

// Breadcrumb modal evenlistener
const breadcrumbModal = document.getElementById("brModal");
const modal = document.getElementById('alapAdatokModal');
breadcrumbModal.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('is-active');
});