import './styles.css';
import { createChart } from './plot.js';
import { fetchIQAir } from './IQAir.js'

import Papa from 'papaparse';
// import data from './files/US_AQI_Lite.csv';
// for zeromq if needed
// const { runServer } = require("./services/server");
// const { runClient } = require("./services/client");
// runServer();
// runClient();

// **current implementation uses csv-loader with webpack, wont work locally **
const csvFilePath = './files/US_AQI_Lite.csv';
// let parsedData = []

// Parse the CSV data
// Fetch the CSV file and parse it with PapaParse

let parsedData = []

const response = await fetch(csvFilePath);
const csvData = await response.text();
// Parse the CSV data using PapaParse
Papa.parse(csvData, {
header: true, // Treat the first row as headers
dynamicTyping: true, // Automatically convert numbers, booleans, etc.
skipEmptyLines: true, // Ignore empty lines
complete: function(results) {
    parsedData = results.data; // The parsed CSV data
    console.log(parsedData); // Log the parsed data
    
    // You can now use `parsedData` for further processing
},
error: function(error) {
    console.error('Error parsing CSV:', error);
}
});

let cleanData = []; // Store parsed CSV data
let filteredData = []; // Store filtered data
const downloadOriginalBtn = document.getElementById('downloadOriginal')
const downloadFilterBtn = document.getElementById('downloadFiltered')

cleanData = parsedData.map(row => {
    const cleanedRow = {};
    
    Object.keys(row).forEach(key => {
        // Clean the key: remove surrounding quotes and any leading/trailing spaces
        const cleanKey = key.trim().toLowerCase().replace(/^"|"$/g, '').replace(/\\"/g, '"');
        
        const value = row[key];
        const cleanValue = typeof value === 'string' 
            ? value.trim().toLowerCase().replace(/^"|"$/g, '').replace(/\\"/g, '"') 
            : value;
        
        // Add cleaned key-value pair to the new row object
        cleanedRow[cleanKey] = cleanValue;
    });
    return cleanedRow;
});

console.log(cleanData)

// Filter data when the user clicks "Apply Filter"
document.getElementById('applyStateFilter').addEventListener('click', function() {
    const filterState = document.getElementById('filterState').value.trim().toLowerCase();

    let uniqueStates = [...new Set(cleanData.map(row => row['state_id']))]; // Get unique states

    if (filterState && uniqueStates.includes(filterState)) {
        // Filter data based on user input
        filteredData = cleanData.filter(row => row['state_id'] === filterState);
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



createChart()
fetchIQAir()
