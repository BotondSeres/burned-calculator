export function saveToLocalStorage(data, name, dataType){
    if(dataType == "json"){
        localStorage.setItem(name, JSON.stringify(data));
    }
}
export function getFromLocalStorage(name, dataType){
    const raw = localStorage.getItem(name);

    // nincs ilyen kulcs
    if (raw === null) {
        return null;
    }
    if (dataType === "json") {
        return JSON.parse(raw);
    }else if(dataType ==="string"){
        return raw
    }else{
        console.error("Unsupported data type for localStorage retrieval.");
        return null; 
    }

} 
export function getMaxIDFromLocalStorage(name){
    let maxId = 0;
    const saveDate = getFromLocalStorage("saveDate", "string")
    const today = new Date().toISOString().slice(0, 10); 
    if(saveDate == `"${today}"`){
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            // csak az adott típusú elemeket nézzük, pl. "activity["
            if (key.startsWith(name + '[') && key.endsWith(']')) {
            const inside = key.slice(name.length + 1, -1); // [] közötti rész
            const id = Number(inside);

            if (!Number.isNaN(id) && id > maxId) {
                maxId = id;
            }
            }
        }
    }

    return maxId; // ha nincs semmi, marad 0
}
export function clearOutdatedActivities(){
    const name = "activity";
    const today = new Date().toISOString().slice(0, 10);
    console.log("Today:",today);
    const saveDate = getFromLocalStorage("saveDate", "json");
    console.log("Save date: ", saveDate);
    const maxId = getMaxIDFromLocalStorage(name);
    if(maxId == 0){ 
        return;
    }else {
        if(saveDate != today) {
            for(let i = 1; i <= maxId; i++){
                localStorage.removeItem(`${name}[${i}]`);
            }
        }else{
            return;
        }   
    }
};
