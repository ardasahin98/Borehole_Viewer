// Function to determine the correct SVG hatch code based on the soil description
function get_hatch_code(soilDescription) {
    let classifications = ['GW', 'GP', 'GM', 'GC', 'SW', 'SP', 'SM', 'SC', 'ML', 'CL', 'OL', 'MH', 'CH', 'OH', 'PT'];
    let soilDescriptionArray = soilDescription.replace(/[^A-Za-z0-9 ]/g, '').split(' ');

    // Try to match directly from classifications first
    for (let classification of classifications) {
        if (soilDescriptionArray.includes(classification)) {
            return classification;
        }
    }

    // If no match found, try advanced classification logic
    const soil_types = ["GRAVEL", "SAND", "SILT", "CLAY", "PEAT"];
    const soil_descriptions = {
        "GRAVEL": { "GW": ["WELL", "GRADED", "SANDY"], "GP": ["POORLY", "UNIFORM"], "GM": ["SILTY"], "GC": ["CLAYEY"] },
        "SAND": { "SW": ["WELL", "GRADED"], "SP": ["POORLY", "UNIFORM"], "SM": ["SILTY"], "SC": ["CLAYEY"] },
        "SILT": { "ML": ["LEAN", "LOW"], "MH": ["FAT", "HIGH"] },
        "CLAY": { "CL": ["LEAN", "LOW"], "CH": ["FAT", "HIGH"] }
    };

    // Try advanced classification based on description
    let classification = get_classification(soilDescriptionArray, soil_types, soil_descriptions, true);
    return classification || "blank";  // Return "blank" if no match found
}

function get_classification(soilArray, soil_types, soil_descriptions, case_sensitive) {
    let soil_type = '';
    for (let type of soil_types) {
        let match = case_sensitive
            ? soilArray.includes(type)
            : soilArray.map(item => item.toLowerCase()).includes(type.toLowerCase());

        if (match) {
            soil_type = type;
            break;
        }
    }

    if (soil_type) {
        let compare = [];
        for (const [key, value] of Object.entries(soil_descriptions[soil_type])) {
            compare.push(count_array_overlap(value, soilArray, case_sensitive));
        }
        let I = indexOfMax(compare);
        return Object.keys(soil_descriptions[soil_type])[I];
    }
    return false;
}

// Simple helper functions
function count_array_overlap(arr1, arr2) {
    let arr1Lower = arr1.map(item => item.toLowerCase());
    let arr2Lower = arr2.map(item => item.toLowerCase());
    return arr1Lower.reduce((a, c) => a + arr2Lower.includes(c), 0);
}

function indexOfMax(arr) {
    return arr.indexOf(Math.max(...arr));
}

// Function to convert SVG string to base64-encoded string
function svgToBase64(svgString) {
    // Convert the raw SVG string to Base64
    return 'data:image/svg+xml;base64,' + btoa(svgString);
}

// Updated SVG map with base64 encoding for all entries
// Assuming your SVG files are located in the 'images' folder relative to your project
const svgMap = {
    'GW': svgToBase64(`<img src="./images/GW.svg" />`),  // Base64 of GW.svg (Well-Graded Gravel)
    'GP': svgToBase64(`<img src="./images/GP.svg" />`),  // Base64 of GP.svg (Poorly-Graded Gravel)
    'GM': svgToBase64(`<img src="./images/GM.svg" />`),  // Base64 of GM.svg (Silty Gravel)
    'GC': svgToBase64(`<img src="./images/GC.svg" />`),  // Base64 of GC.svg (Clayey Gravel)
    'SW': svgToBase64(`<img src="./images/SW.svg" />`),  // Base64 of SW.svg (Well-Graded Sand)
    'SP': svgToBase64(`<img src="./images/SP.svg" />`),  // Base64 of SP.svg (Poorly-Graded Sand)
    'SM': svgToBase64(`<img src="./images/SM.svg" />`),  // Base64 of SM.svg (Silty Sand)
    'SC': svgToBase64(`<img src="./images/SC.svg" />`),  // Base64 of SC.svg (Clayey Sand)
    'ML': svgToBase64(`<img src="./images/ML.svg" />`),  // Base64 of ML.svg (Silt with low plasticity)
    'CL': svgToBase64(`<img src="./images/CL.svg" />`),  // Base64 of CL.svg (Clay with low plasticity)
    'OL': svgToBase64(`<img src="./images/OL.svg" />`),  // Base64 of OL.svg (Organic clay/silt)
    'MH': svgToBase64(`<img src="./images/MH.svg" />`),  // Base64 of MH.svg (Silt with high plasticity)
    'CH': svgToBase64(`<img src="./images/CH.svg" />`),  // Base64 of CH.svg (Clay with high plasticity)
    'OH': svgToBase64(`<img src="./images/OH.svg" />`),  // Base64 of OH.svg (Organic clay/silt with high plasticity)
    'PT': svgToBase64(`<img src="./images/PT.svg" />`),  // Base64 of PT.svg (Peat)
    'blank': svgToBase64(`<img src="./images/blank.svg" />`)  // Base64 of blank.svg (Default blank pattern)
};

// Function to apply the base64-encoded SVG as a background image
function append_svg_base64(svgBase64, elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.backgroundImage = `url(${svgBase64})`;
        element.style.backgroundSize = "contain";
        element.style.backgroundRepeat = "no-repeat";
    }
}
