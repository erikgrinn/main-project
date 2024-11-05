import './styles.css';
import data from './files/cities_air_quality_water_pollution.18-10-2021.csv';
import Papa from 'papaparse';

console.log(data)

// const { runServer } = require("./services/server");
// const { runClient } = require("./services/client");

// runServer();
// runClient();

let cleanData = []; // Store parsed CSV data
let filteredData = []; // Store filtered data
const downloadOriginalBtn = document.getElementById('downloadOriginal')
const downloadFilterBtn = document.getElementById('downloadFiltered')

cleanData = data.map(row => {
    const cleanedRow = {};
    
    Object.keys(row).forEach(key => {
        // Clean the key: remove surrounding quotes and any leading/trailing spaces
        const cleanKey = key.trim().toLowerCase().replace(/^"|"$/g, '').replace(/\\"/g, '"');
        
        const value = row[key];
        const cleanValue = typeof value === 'string' 
            ? value.trim().toLowerCase().replace(/^"|"$/g, '').replace(/\\"/g, '"') 
            : value;
        // // Clean the value: remove surrounding quotes and any leading/trailing spaces
        // const cleanValue = row[key].trim().toLowerCase().replace(/^"|"$/g, '').replace(/\\"/g, '"');
        
        // Add cleaned key-value pair to the new row object
        cleanedRow[cleanKey] = cleanValue;
    });
    return cleanedRow;
});
console.log(cleanData.slice(0,10))


// Assuming parsedData is an array of objects, where each object represents a row from the CSV


// Filter data when the user clicks "Apply Filter"
document.getElementById('applyStateFilter').addEventListener('click', function() {
    const filterState = document.getElementById('filterState').value.trim().toLowerCase();

    let uniqueStates = [...new Set(cleanData.map(row => row['region']))]; // Get unique states

    if (filterState && uniqueStates.includes(filterState)) {
        // Filter data based on user input
        filteredData = cleanData.filter(row => row['region'] === filterState);
        console.log(filteredData)

        downloadFilterBtn.disabled = false
        
    } else {
        alert('Please enter a valid state or region.');
    }
});

downloadOriginalBtn.addEventListener('click', function() {
    const csv = Papa.unparse(cleanData); // Convert filtered data back to CSV format
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'original_data.csv';
    link.click();
    URL.revokeObjectURL(url); // Release memory after download
}) 



downloadFilterBtn.addEventListener('click', function() {
    if (filteredData.length > 0) {
        const csv = Papa.unparse(filteredData); // Convert filtered data back to CSV format
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'filtered_data.csv';
        link.click();
        URL.revokeObjectURL(url); // Release memory after download

        downloadFilterBtn.disabled = true
    } else {
        alert('No data to download.');
    }
});
