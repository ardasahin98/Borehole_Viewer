document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('uploadExcel').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        const fileType = file.name.split('.').pop().toLowerCase();

        reader.onload = function(e) {
            if (fileType === 'xlsx' || fileType === 'xls') {
                // Process Excel file
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array'});

                // Read each sheet and convert it to JSON
                const metadataSheet = workbook.Sheets['borehole_metadata'];
                const stratigraphySheet = workbook.Sheets['stratigraphy'];
                const samplesSheet = workbook.Sheets['samples'];

                // Convert sheets to JSON format
                const metadata = XLSX.utils.sheet_to_json(metadataSheet)[0]; // Assuming one row for metadata
                const stratigraphy = XLSX.utils.sheet_to_json(stratigraphySheet);
                const samples = XLSX.utils.sheet_to_json(samplesSheet);

                // Process the sheets to match the expected structure
                let processedData = processExcelData(metadata, stratigraphy, samples);

                // Set processed Excel data to textarea
                $('#boringlogjson').val(JSON.stringify(processedData, null, 4));
            } else if (fileType === 'json') {
                // Process JSON file
                try {
                    const jsonData = JSON.parse(e.target.result);

                    // Set JSON data to textarea
                    $('#boringlogjson').val(JSON.stringify(jsonData, null, 4));
                } catch (error) {
                    console.error('Invalid JSON file format', error);
                    alert('Invalid JSON file. Please upload a valid JSON.');
                }
            }
        };

        if (fileType === 'xlsx' || fileType === 'xls') {
            reader.readAsArrayBuffer(file);
        } else if (fileType === 'json') {
            reader.readAsText(file);
        } else {
            alert('Unsupported file format. Please upload a .xlsx, .xls, or .json file.');
        }
    });
});

// Process the Excel data into the format needed
function processExcelData(metadata, stratigraphy, samples) {
    // Extract and structure metadata
    let boreholeMetadata = {
        project_name: metadata.project_name,
        site_name: metadata.site_name,
        borehole_name: metadata.borehole_name,
        longitude: metadata.longitude,
        latitude: metadata.latitude,
        date: metadata.date,
        borehole_type: metadata.borehole_type,
        rig: metadata.rig,
        logger: metadata.logger,
        borehole_diameter: metadata.borehole_diameter,
        hammer_mechanism: metadata.hammer_mechanism,
        groundwater_depth: metadata.groundwater_depth
    };

    // Extract and structure stratigraphy data
    let stratigraphyData = {
        stratum_depth_top: stratigraphy.map(row => row.stratum_depth_top),
        stratum_depth_bottom: stratigraphy.map(row => row.stratum_depth_bottom),
        soil_description: stratigraphy.map(row => row.soil_description)
    };

    // Extract and structure samples data
    let samplesData = {
        sampler_type: samples.map(row => row.sampler_type),
        soil_classification: samples.map(row => row.soil_classification),
        sampler_outer_diameter: samples.map(row => row.sampler_outer_diameter),
        sampler_inner_diameter: samples.map(row => row.sampler_inner_diameter),
        depth_top: samples.map(row => row.depth_top),
        depth_bottom: samples.map(row => row.depth_bottom),
        sample_description: samples.map(row => row.sample_description),
        internal_blow_count: samples.map(row => row.internal_blow_count),
        blow_count: samples.map(row => row.blow_count),
        energy_ratio: samples.map(row => row.energy_ratio),
        rod_length: samples.map(row => row.rod_length),
        nonplastic: samples.map(row => row.nonplastic),
        liquid_limit: samples.map(row => row.liquid_limit),
        plastic_limit: samples.map(row => row.plastic_limit),
        dry_unit_weight: samples.map(row => row.dry_unit_weight),
        water_content: samples.map(row => row.water_content),
        shear_strength: samples.map(row => row.shear_strength),
        shear_strength_method: samples.map(row => row.shear_strength_method)
    };

    return {
        borehole_metadata: boreholeMetadata,
        stratigraphy: stratigraphyData,
        samples: samplesData
    };
}