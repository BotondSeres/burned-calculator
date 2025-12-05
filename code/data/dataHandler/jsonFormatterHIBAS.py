# Arra használom ezt a kis scriptet, hogy az excelben megszerzett és szűrt MET adatokat egy struktúra szerint JSON file formátummá alakítsam.
# Nincs szerepe a webapp működésében, csak a fejlesztéshez használtam.
# A python PANDAS modulját használom.

import pandas as pd
import json
from pathlib import Path

# ----------------------------------------------------
# 1. Config
# ----------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
EXCEL_PATH = (BASE_DIR / "metExcelSports.xlsx").resolve()
SHEET_NAME = "SportsMET_Filtered" # or None / sheet index
JSON_OUT   = (BASE_DIR / "metSports.json").resolve()

# ----------------------------------------------------
# 2. Excel -- > DataFrame
# ----------------------------------------------------
def load_data(path: Path, sheet_name=None) -> pd.DataFrame:
    df = pd.read_excel(path, sheet_name=sheet_name)
    # Optional: drop completely empty rows/cols
    df = df.dropna(how="all").reset_index(drop=True)
    return df

# ----------------------------------------------------
# 2. DataFrame -- > JSON struktúra
# ----------------------------------------------------

def build_structure(df: pd.DataFrame):
    """
    Expected columns in df:
    - 'Category'
    - 'Activity'
    - 'Activity Code'  (used as Id)
    - 'Intensity'      (e.g. 1, 2, 3, 4)
    - 'MET Value'
    Returns a nested dict:

    {
      "CategoryName1": {
        "ActivityName1": {
          "Id": XYZ,
          "Intensity": {
            "01": METValue1,
            "02": METValue2,
            ...
          }
        },
        "ActivityName2": { ... }
      },
      "CategoryName2": { ... }
    }
    """
    result = {}

    # Make sure numeric columns are numeric
    df["Activity Code"] = pd.to_numeric(df["Activity Code"], errors="coerce")
    df["Intensity"] = pd.to_numeric(df["Intensity"], errors="coerce")
    df["MET Value"] = pd.to_numeric(df["MET Value"], errors="coerce")

    # Drop rows without Activity or MET value
    df = df.dropna(subset=["Activity", "MET Value"])

    # Loop by category
    for category, cat_group in df.groupby("Category"):
        cat_dict = {}

        # Loop by activity within each category
        for activity, act_group in cat_group.groupby("Activity"):
            # Use first Activity Code for this activity as Id
            first_row = act_group.iloc[0]
            act_id = int(first_row["Activity Code"]) if not pd.isna(first_row["Activity Code"]) else None

            # Build Intensity dict: "01" -> met_value, etc.
            intensity_dict = {}
            for _, row in act_group.iterrows():
                if pd.isna(row["Intensity"]) or pd.isna(row["MET Value"]):
                    continue
                level_key = int(row["Intensity"]) 
                met_value = float(row["MET Value"])
                intensity_dict[level_key] = met_value
            
            ordered_intensity = {
                f"{k:02d}": intensity_dict[k]
                for k in sorted(intensity_dict.keys())
            }

            cat_dict[activity] = {
                "Id": act_id,
                "Intensity": ordered_intensity
            }

        result[category] = cat_dict

    return result


# ----------------------------------------------------
# 5. Save as JSON
# ----------------------------------------------------
def save_json(data, path: Path, indent: int = 2):
    print("Saving JSON to:", path)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=indent)

# ----------------------------------------------------
# 6. Main script
# ----------------------------------------------------
def main():
    df = load_data(EXCEL_PATH, SHEET_NAME)
    data = build_structure(df)
    save_json(data, JSON_OUT)
    print("JSON saved.")

if __name__ == "__main__":
    main()
    
