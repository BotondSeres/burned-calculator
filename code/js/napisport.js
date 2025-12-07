import { getFromLocalStorage, saveToLocalStorage, getMaxIDFromLocalStorage, clearOutdatedActivities } from "./localStorage.js";
const metData = getFromLocalStorage("metData", "json");
console.log(metData);
let profileData = {};
function getProfileData(){
    profileData = getFromLocalStorage("profileData", "json");
    if(profileData === null){
        const profileDataHidden = document.getElementById("profileDataHidden");
        profileDataHidden.value = 0;
        noProfileData(profileDataHidden);
    }else{
        profileDataHidden.value = 1; // van profil adat
        console.log("Profile data loaded.")
    }
}
function noProfileData(profileDataHidden){
    if(profileDataHidden.value == 0){
        window.location.href = "altalanos.html"
    }else if(profileDataHidden.value == 1){
        return;
    }
}
let kategoriaLista = [];
metData.forEach(kategoria =>{
    kategoriaLista.push(`${kategoria.category}`);
})

document.addEventListener('DOMContentLoaded', (e) => {
    getProfileData();
    clearOutdatedActivities();
    refreshTable();
    setupDeleteButtons();
    normalizeActivitiesInLocalStorage();
});

// #region Dropdownok
// Kategoria dropdown gomb kezelése
const kategoriaDropdown = document.getElementById("kategoriaDropdown");
const kategoriaDropdownActive = document.getElementById("kategoriaDropdownActive");
kategoriaDropdown.addEventListener('click', (e) => {
    kategoriaDropdownActive.classList.toggle('is-active');
    activityDropdownActive.classList.remove('is-active');
});
// Kategória menü feltöltése
const kategoriaMenu = document.getElementById("category_dropdown-menu");
kategoriaLista.forEach(kategoria => {
    const a = document.createElement("a");
    a.innerHTML = `<a class="dropdown-item categoryItem">${kategoria}</a>`;
    kategoriaMenu.appendChild(a);
});
const categoryItems = document.querySelectorAll(".categoryItem");
const kategoriaSzoveg = document.getElementById("chosenCategory");
let selectedCategory = "";
let selectedActivity = "";
categoryItems.forEach(item => {
    item.addEventListener('click', (e) => {
        kategoriaSzoveg.innerText = item.innerText;
        const activitySzoveg = document.getElementById("chosenActivity");
        activitySzoveg.innerText = "Mozgás";
        const intensitySlider = document.getElementById("intensitySlider");
        intensitySlider.value = 0;
        kategoriaDropdownActive.classList.remove('is-active');
        if(kategoriaSzoveg.innerText != "Kategória"){
            
            const activityMenu = document.getElementById("activity_dropdown-menu");
            // Menü feltöltése a kiválasztott kategória alapján
            selectedCategory = kategoriaSzoveg.innerText;

            const selectedActivities = metData.find(cat => cat.category === selectedCategory).elements.map(act => act.name);
            //console.log(selectedActivities);
            activityMenu.innerHTML = ""; // Korábbi elemek törlése
            selectedActivities.forEach(activity => {
                const a = document.createElement("a");
                a.innerHTML = `<a class="dropdown-item activityItem">${activity}</a>`;
                //console.log(a);
                activityMenu.appendChild(a);
            });
            activityDropdown.disabled = false;
            // Activity menü működés
            let activityItems = document.querySelectorAll(".activityItem");
            
            activityItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    const activitySzoveg = document.getElementById("chosenActivity");
                    activitySzoveg.innerText = item.innerText;
                    const intensitySlider = document.getElementById("intensitySlider");
                    intensitySlider.value = 0;
                    activityDropdownActive.classList.remove('is-active');
                    if(activitySzoveg.innerText != "Mozgás"){
                        // Menü feltöltése a kiválasztott kategória alapján
                        selectedActivity = activitySzoveg.innerText;
                        console.log(selectedActivity)
                        const kategoria = metData.find(r =>
                                                    r.category === selectedCategory &&
                                                    r.elements.some(e => e.name === selectedActivity)
                                                    );
                        const record = kategoria.elements.find(r => r.name == selectedActivity)
                        console.log(record)
                        if(record.intensity.length == 1){
                           const intensitySlider = document.getElementById("intensitySlider");
                           intensitySlider.disabled = true;
                        }else{
                            const intensitySlider = document.getElementById("intensitySlider");
                           intensitySlider.disabled = false;
                        }
                    }
                })
            });
        }
    })
});

// Met szurese: metData.find(cat=> cat.category == selectedCategory).elements.find(act => act.name == selectedActivity).intensity[0].value
// Activity dropdown gomb kezelése
const activityDropdown = document.getElementById("activityDropdown");
const activityDropdownActive = document.getElementById("activityDropdownActive");
activityDropdown.addEventListener('click', (e) => {
    activityDropdownActive.classList.toggle('is-active');
    kategoriaDropdownActive.classList.remove('is-active');
});

// #endregion

// #region Idősáv kezelése
function idoKezeles(){
const startHourInput = document.getElementById("startHour");
const endHourInput = document.getElementById("endHour");
const startMinuteInput = document.getElementById("startMinute");
const endMinuteInput = document.getElementById("endMinute");
let hiba = [];
if(!(/^(?:[0-9]|1[0-9]|2[0-3])$/.test(startHourInput.value))) // csak számok, nem kezdődik 0-val
    {
      hiba.push("Helytelenül megadott kezdő óra!");
      console.log("Regex kezdő óra hiba!");  
    }
if(!(/^(?:[0-9]|1[0-9]|2[0-3])$/.test(endHourInput.value))) // csak számok, nem kezdődik 0-val
    {
      hiba.push("Helytelenül megadott vég óra!");
      console.log("Regex vég óra hiba!");  
    }
if(!(/^([0-5][0-9])$/.test(endMinuteInput.value))) // csak számok, nem kezdődik 0-val
    {
      hiba.push("Helytelenül megadott vég perc!");
      console.log("Regex vég perc hiba!");  
    }
if(!(/^([0-5][0-9])$/.test(startMinuteInput.value))) // csak számok, nem kezdődik 0-val
    {
      hiba.push("Helytelenül megadott kezdő perc!");
      console.log("Regex kezdő perc hiba!");  
    }
if (hiba.length > 0) {
      hiba.forEach(hiba => {
        alert(hiba)
      });
      return null;
}else{
    let startTimeM = parseInt(startHourInput.value) * 60 + parseInt(startMinuteInput.value);
    let endTimeM = endHourInput.value * 60 + parseInt(endMinuteInput.value);
    let startHour = parseInt(startHourInput.value);
    let endHour = parseInt(endHourInput.value);
    let startMinute = removeLeadingZero(parseInt(startMinuteInput.value));
    let endMinute = removeLeadingZero(parseInt(endMinuteInput.value));
    if(endTimeM <= startTimeM){
        endTimeM += 1440;
    }
    let timeDiff = endTimeM - startTimeM;
    let kezdesFormazott = `${String(startHourInput.value).padStart(2,'0')}:${String(startMinuteInput.value).padStart(2,'0')}`;
    let befejezesFormazott = `${String((Math.floor(endTimeM/60))%24).padStart(2,'0')}:${String(endTimeM%60).padStart(2,'0')}`;
    return {startTimeM, endTimeM, timeDiff, kezdesFormazott, befejezesFormazott, startHour, endHour, startMinute, endMinute};
}
};

function removeLeadingZero(str) {
  return str.startsWith('0') ? str.slice(1) : str;
}

// # region Slider kezelése
const intensitySlider = document.getElementById("intensitySlider");
let intensityValue = 0;
let currentSliderSteps = 33
intensitySlider.addEventListener('change', (e) => {
    console.log("Intensity value: "+ intensitySlider.value/currentSliderSteps)
    intensityValue = intensitySlider.value/currentSliderSteps;
});

// #endregion
// #region Sport Submit kezelése
const sportSubmit = document.getElementById("sportSubmit");
sportSubmit.addEventListener('click', (e) => {
    let idoO = idoKezeles();
    if(idoO != null && (idoO.timeDiff > 0 && selectedActivity != "Mozgás" && selectedCategory != "Kategória" && idoO.startHour >=0 && idoO.startHour <24 && idoO.endHour >=0 && idoO.endHour <24 && idoO.startMinute >=0 && idoO.startMinute <60 && idoO.endMinute >=0 && idoO.endMinute <60)){
        e.preventDefault();
        saveNewActivity(selectedCategory, selectedActivity, intensityValue, idoO);
        alert("Sikeres mentés!");
    }else{
        e.preventDefault();
        alert("Kérem, helyesen töltse ki az összes mezőt!");
    }
}
);
// #endregion
function saveNewActivity(selectedCategory, selectedActivity, intensityValue, idoO){
    const today = new Date().toISOString().slice(0, 10);
    const newActivity = {
        dataType: "activityEntry",
        category: selectedCategory,
        activity: selectedActivity,
        met: metValueSearch(selectedCategory, selectedActivity, intensityValue),
        startF: idoO.kezdesFormazott,
        endF: idoO.befejezesFormazott,
        durationM: idoO.timeDiff,
        startM: idoO.startTimeM,
        endM: idoO.endTimeM
    };
    let id = getMaxIDFromLocalStorage("activity") + 1;
    saveToLocalStorage(newActivity, `activity[${id}]`, "json");
    saveToLocalStorage(today, "saveDate", "json");
    refreshTable();
    normalizeActivitiesInLocalStorage()
}
function metValueSearch(selectedCategory, selectedActivity, intensityValue){
    return metData.find(cat=> cat.category == selectedCategory).elements.find(act => act.name == selectedActivity).intensity[intensityValue].value;
}

function refreshTable(){
    const tableBody = document.getElementById("activityTableBody");
    tableBody.innerHTML = ""; // Törli a meglévő sorokat
    const maxId = getMaxIDFromLocalStorage("activity");
    let activities = [];
    for(let i = 1; i <= maxId; i++){
        const activity = getFromLocalStorage(`activity[${i}]`, "json");
        if(activity != null){
            activities.push(activity);
        }
    }
    console.log("Activities in refresh table:" + activities)
    // Re-ordering activities by startTimeM
    activities.sort((a, b) => a.startM - b.startM);
    activities.forEach((activity, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <th>${i+1}</th>
            <td>${activity.activity}</td>
            <td>${activity.startF}</td>
            <td>${activity.endF}</td>
            <td><button id="delete[${i+1}]" class="button is-danger is-rounded deleteButton"><i class="material-icons">delete</i></button></td>
        `; 
        tableBody.appendChild(row); 
    });
    console.log("Inside Table Refresh")
    setupDeleteButtons();
    
}
function setupDeleteButtons(){
    // Törlés gombok kezelése
    const deleteButtons = document.querySelectorAll(".deleteButton");
    //console.log(deleteButtons);
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            //e.preventDefault();
            const id = button.id.slice(7, -1); // Extract the id from "delete[id]"
            console.log("Deleting activity with id:", id);
            localStorage.removeItem(`activity[${id}]`);
            refreshTable(); // Refresh the table after deletion
            normalizeActivitiesInLocalStorage();
        });
});
}
function normalizeActivitiesInLocalStorage() {
  const rows = document.querySelectorAll('#activityTableBody tr');
  const maxId = getMaxIDFromLocalStorage("activity");
    let activities = [];
    for(let i = 1; i <= maxId; i++){
        const activity = getFromLocalStorage(`activity[${i}]`, "json");
        if(activity != null){
            activities.push(activity);
        }
    }

  // 2) Minden régi activity[*] kulcs törlése
  //const maxId = getMaxIDFromLocalStorage('activity');
  for (let i = 1; i <= maxId; i++) {
    localStorage.removeItem(`activity[${i}]`);
    console.log("Deleting for reorder: "+ i )
  }
  console.log(activities)
  // 3) Visszaírás a TÁBLA sorrendje szerint új ID-kkel
  activities.sort((a, b) => a.startM - b.startM);
  activities.forEach((act, index) => {
    const newId = index + 1;                     // 1..N
    saveToLocalStorage(act, `activity[${newId}]`, 'json');
  });
}

// Breadcrumb modal evenlistener
const breadcrumbModal = document.getElementById("brModal");
const modal = document.getElementById('alapAdatokModal');
breadcrumbModal.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('is-active');
});