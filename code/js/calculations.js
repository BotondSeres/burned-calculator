export function GetBmi(Height, Weight){
     if (Height == -1 || Weight == -1)
     {
         return -1;
     }
     let num = Height / 100;
     return (Weight / (num**2)).toFixed(1);
}

// Bazális anyagcsere
export function CalculateBMR(sex, height, weight, age){ //Harris Benedict RMR
            let result = 0;
            /* For men: BMR = 66.5 + (13.75 × weight in kg) + (5.003 × height in cm) - (6.75 × age)

            For women: BMR = 655.1 + (9.563 × weight in kg) + (1.850 × height in cm) - (4.676 × age) */

            if (sex === "1") // sex = 1 => Male
            {
                result = parseInt(Math.ceil((66.4730 + (13.7516 * weight) + (5.0033 * height) - (6.7550 * age))));
            }else
            {
                result = parseInt(Math.ceil((655.0955 + (9.5634 * weight) + (1.8496 * height) - (4.6756 * age))));
            }
            return result;
}
export function CalculateWorkingDailyEnergyExpenditure(BasalMetabolism, level){
        let activityLevelValue = 0;
        if (BasalMetabolism == 0)return 0;
        
        switch (level)
        {
            case "0":
                activityLevelValue = 1.4;
                break;

            case "1":
                activityLevelValue = 1.5;
                break;

            case "2":
                activityLevelValue = 1.6;
                break;

            case "3":
                activityLevelValue = 1.7;
                break;

        }
        return (BasalMetabolism * activityLevelValue).toFixed(0);
}

export function CalculateIdealWeightHamwi(Gender, Height){
        var result = "";
        Height = Height*10; // Azért szorzom fel 10-zel, hogy beleilleszkedjen a lenti képletbe

        //M = 48 kg for the first 152.4 cm + 1.1 kg for each additional cm.

        //F = 45 kg for the first 152.4 cm + 0.9 kg for each additional cm.
        if (Gender === "1"){ //ferfi
            if (Height > 1523){
                result = (48 + ((Height - 1524) * 0.11)).toFixed(1); // a belső részen mindent szoroztam 10-zel, kívül osztottam, hogy a Height maradhasson egész szám
            }else // ha kisebb mint 152.4
            {
                result = (48 - ((1524 - Height) * 0.11)).toFixed(1);
            }
        }else // Nő
        {
            if (Height > 1523){
                result = (45 + ((Height - 1524) * 0.09)).toFixed(1);
            }else // ha kisebb mint 152.4
            {
                result = (45 - ((1524 - Height) * 0.09)).toFixed(1);
            }
        }
        return result;
}

 

// Normal: 18.5-24.9
export function BmiToKg(BmiValue,Height){
        return parseInt(BmiValue * ((Height / 100)**2));
    }


export function metEnergyExpenditure(minutes, MET, bodyweight){
    let energyExpenditure = 0;
    const hours = minutes / 60;
    energyExpenditure = hours * MET * bodyweight;
    return energyExpenditure // KCal
}