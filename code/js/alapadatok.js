// EZ A SCRIPT CSAK A MODAL KEZELÉSÉÉRT FELEL!
import { saveToLocalStorage, getFromLocalStorage } from "./localStorage.js";
// #region Modal
/* Modal kezelése:
- Megnyitás: alapAdatok legyen az ID-ja annak ami megnyitja a modalt.
- HTML: Be kell másolni minden html végére a modal kódját*/
const modal = document.getElementById('alapAdatokModal');
const openLink = document.getElementById('alapAdatok');
const closeBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelModal');

const profileData = getFromLocalStorage("profileData", "json");
openLink.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('is-active');
});

document.addEventListener("DOMContentLoaded", e =>{
  if(profileData != null){
      const age = document.getElementById('AgeInput');
      const weight = document.getElementById('weightInput');
      const height = document.getElementById('heightInput');
      const workplaceActivity = document.getElementById(`wa${profileData.workplaceActivity}`)
      const workplaceActivityLabel = document.getElementById(`wal${profileData.workplaceActivity}`)
      const gender = document.getElementById(`sex${profileData.sex}`)
      const genderLabel = document.getElementById(`sexl${profileData.sex}`)
      age.value = profileData.age;
      weight.value = profileData.weight;
      height.value = profileData.height;
      workplaceActivity.checked = true;
      workplaceActivityLabel.classList.add("is-selected")
      gender.checked = true;
      genderLabel.classList.add("is-selected")

    } 
});

const closeModal = (e) => {
  modal.classList.remove('is-active');
};

closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Háttérre kattintás is bezár
modal.querySelector('.modal-background').addEventListener('click', closeModal);

//#region Workplace Activity 
const waHelpData = {
  "0": "A nap nagy részében a számítógép előtt, vagy egy asztalnál ül.",
  "1": "Könnyű fizikai munka, például értékesítési vagy irodai munka, amely könnyű tevékenységeket foglal magában.",
  "2": "Általános fizikai munka, például takarítás, konyhai személyzet, karbantartó, vagy postai kézbesítés gyalog vagy kerékpárral.",
  "3": "Nehéz fizikai munka, például építőipari, mezőgazdasági munka, vagy profi sportoló."
};


// workplaceActivity radio + label kezelése
const activityLabels = document.querySelectorAll('#workplaceActivity .button');
const radios = document.querySelectorAll('#workplaceActivity .WAButton');
activityLabels.forEach(label => {
  label.addEventListener('click', (e) => {
    // 1) összes gomból levesszük az is-active-et
    activityLabels.forEach(l => l.classList.remove('is-selected'));
    radios.forEach(r => r.checked = "false");


    // 2) a kattintott labelre rátesszük
    label.classList.add('is-selected');
    const radio = label.querySelector('input.WAButton');
    radio.checked = true;

    // 3) Help szöveg átírása:
    const help = document.getElementById("WAhelp");
    help.innerText = waHelpData[label.dataset.value];
  });
});

//#endregion

// #region Sex radio + label handling
const sexSelectors = document.querySelectorAll('#sex .button');
const sradios = document.querySelectorAll('#sex .sexButton');
sexSelectors.forEach(label => {
  label.addEventListener('click', (e) => {
    // 1) összes gomból levesszük az is-active-et
    sexSelectors.forEach(l => l.classList.remove('is-selected'));
    sradios.forEach(r => r.checked = "false");


    // 2) a kattintott labelre rátesszük
    label.classList.add('is-selected');
    const radio = label.querySelector('input.sexButton');
    radio.checked = true;
  });
});

//#endregion
// #endregion

// #region Modal Adatok mentése LocalDB-be
const saveButton = document.getElementById('profileModalSave');
saveButton.addEventListener('click', (e) => {
  e.preventDefault();
  // Adatok begyűjtése
  const age = document.getElementById('AgeInput');
  const weight = document.getElementById('weightInput');
  const height = document.getElementById('heightInput');
  const sex = document.querySelector('input[name="sexRadio"]:checked');
  const workplaceActivity = document.querySelector('input[name="workplaceRadio"]:checked');
  const errors = [];
  // #region Validáció 
  if (!age.value.trim()) {
    errors.push('életkor');
  }
  if (!height.value.trim()) {
    errors.push('magasság');
  }
  if (!weight.value.trim()) {
    errors.push('testsúly');
  }
  if(sex == null){
    errors.push('nem');
  }
  if(workplaceActivity == null){
    errors.push('munkahelyi aktivitás');
  }
  if (errors.length > 0) {
    alert('Ezeket még kötelező kitölteni: ' + errors.join(', ') + "!");
    return;
    // #endregion
  }else{
    // # region Validáció 2 => formátum

    let hiba = [];
    if(!(/^([1-9][0-9]*)$/.test(age.value))) // csak számok, nem kezdődik 0-val
    {
      hiba.push("Helytelenül életkor formátum!");
      console.log("Regex életkor Hiba!");  
    }else if(age.value < 10 || age.value > 105){
        hiba.push("Életkor csak 10 és 105 év között engedélyezett.");
      }
    if(!(/^([1-9][0-9]*)$/.test(height.value))) // csak számok, nem kezdődik 0-val
    {
      hiba.push("Helytelenül magasság formátum!");
      console.log("Regex magasság Hiba!");
    }else if(height.value < 100 || height.value > 205){
      hiba.push("Magasság csak 100cm és 205cm között engedélyezett.");
    }
    if(!(/^([1-9][0-9]*)$/.test(weight.value))) // csak számok, nem kezdődik 0-val
    {
      hiba.push("Helytelenül tesúly formátum!");
      console.log("Regex testsúly Hiba!");
    }else if(weight.value < 20 || weight.value > 150){
      hiba.push("Testsúly csak 20 és 150 kg között engedélyezett.");
    }
    console.log(hiba);
    if (hiba.length > 0) {
      hiba.forEach(hiba => {
        alert(hiba)
      });
      return;
      // #endregion
    }else{
      console.log("Adatok mentése:", age.value, weight.value, height.value, sex.value, workplaceActivity.value);
      const data = {
        dataType: "profileData",
        age: parseInt(age.value),
        weight: parseInt(weight.value),
        height: parseInt(height.value),
        sex: sex.value,
        workplaceActivity: workplaceActivity.value
      }
      console.log("Mentendő adat:", data);
      // Adatok mentése
      saveToLocalStorage(data, 'profileData', 'json');
      closeModal();
      location.reload();
    }
    }
});

// #endregion