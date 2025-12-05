
// Load MET sports data
import { saveToLocalStorage } from './localStorage.js';

const metJsonPath = '/code/data/metSports.json';

async function fetchMetSports(){
    if (localStorage.getItem("metData") == null){
        try{
            const response = await fetch(metJsonPath);
            if (!response.ok) {
                throw new Error("Could not fetch MET Data!")
            }
            const data = await response.json();
            saveToLocalStorage(data, "metData", "json");
        }
        catch (error){
            console.error('Error fetching MET Sports Data:', error);
        }
    }else{
        console.log("MET Sports Data already in localStorage.");
    }
}
fetchMetSports();

