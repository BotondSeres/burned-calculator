const modal = document.getElementById('alapAdatokModal');
export let openLink;
const closeBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelModal');

openLink.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('is-active');
});

export const closeModal = (e) => {
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
