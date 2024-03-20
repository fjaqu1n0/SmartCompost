$(document).ready(function() {

//--TABLE CONFIGURATION-------------------------//

//Global Variables
  var isEditing = false;
  var currentInput;  
  var firstClickedIndex = null;
   var lastId = localStorage.getItem('lastId') ? parseInt(localStorage.getItem('lastId'), 10) : 0;

// Initially disable edit and delete buttons
$('#editButton').prop('disabled', true);
$('#deleteButton').prop('disabled', true);

//Table Settings
var table = $('#sensorData').DataTable({
    'columnDefs': [{
        'targets': 0, // Adding a target for the new checkbox column
        'searchable': false,
        'orderable': false,
        'className': 'dt-body-center',
        'render': function(data, type, full, meta) {
            return '<input type="checkbox" class="dt-checkbox">';
        }
    }],
    "ajax": {
        "url": "php/tableGenerator.php",
        "type": "POST",
        "data": {
            "lastId": lastId
        },
        "dataSrc": function(json) {
            var deletedIds = JSON.parse(localStorage.getItem('deletedRowIds') || '[]');
            if (json.totalRows === 0) {
                localStorage.removeItem('dataTableEdits');
                // Optionally, update this condition to better suit how you determine a significant change
            }
            return json.filter(function(row) {
                return deletedIds.indexOf(row.id) === -1;
            });
        }
    },
 
    "columns": [
        { "data": null, "defaultContent": '', "title": '<input type="checkbox" id="selectAll">', "orderable": false, "name": "select_all" }, // Checkbox column, name added just for consistency, it's not used in saveChanges
        { "data": "id", "visible": false, "name": "id" }, // Added name property
        { "data": "timestamp", "name": "timestamp" }, // Added name property
        { "data": "air_humidity", "name": "air_humidity" }, // Added name property
        { "data": "air_temperature", "name": "air_temperature" }, // Added name property
        { "data": "soil_temperature", "name": "soil_temperature" }, // Added name property
        { "data": "soil_moisture_3in1", "name": "soil_moisture_3in1" }, // Added name property
        { "data": "soil_pH", "name": "soil_pH" } // Added name property
    ],
    
    rowReorder: true,
   
    "initComplete": function() {
        var savedPage = localStorage.getItem('dataTableCurrentPage');
        if (savedPage !== null) {
            this.api().page(parseInt(savedPage)).draw('page');
        }
    
        var edits = JSON.parse(localStorage.getItem('dataTableEdits') || '{}');
        Object.entries(edits).forEach(([rowId, colValues]) => {
            var rowIndexes = this.api().rows().indexes().filter((idx) => {
                var data = this.api().row(idx).data();
                return data && data.id.toString() === rowId;
            });
    
            if (rowIndexes.length > 0) {
                Object.entries(colValues).forEach(([colIdx, value]) => {
                    var cell = this.api().cell(rowIndexes[0], parseInt(colIdx));
                    if (cell.node()) {
                        cell.data(value);
                    }
                });
            }
        });
    
        this.api().draw(false);
    },  
    "drawCallback": function() {
        var api = this.api();
        var edits = JSON.parse(localStorage.getItem('dataTableEdits') || '{}');
        Object.entries(edits).forEach(([rowId, colValues]) => {
            Object.entries(colValues).forEach(([colIdx, value]) => {
                var cell = api.cell(rowId, colIdx);
                if (cell.node()) { // Check if the cell exists
                    cell.data(value);
                }
            });
        });
        //api.draw(false); // Optional, depending on your needs
    }
    
  });
   // Retrieve the saved page number and set it
   var savedPage = localStorage.getItem('dataTableCurrentPage');
   if (savedPage !== null) {
       table.page(parseInt(savedPage)).draw(false);
   }

   setInterval(function() {
    if (!isEditing) { // Ensure edits aren't being made currently
        // Capture IDs of selected rows before the table reload
        var selectedIDs = $.map(table.rows('.selected').data(), function(item) {
            return item.id; // Assuming 'id' is part of your row data structure
        });

        var currentPage = table.page(); // Store the current page before reloading

        table.ajax.reload(function() {
            // Reapply edits after the new data has been loaded
            var edits = JSON.parse(localStorage.getItem('dataTableEdits') || '{}');
            Object.entries(edits).forEach(([rowId, colValues]) => {
                Object.entries(colValues).forEach(([colIdx, value]) => {
                    var rowIdx = table.rows(function(idx, data, node) {
                        return data.id.toString() === rowId; // Ensure this matches your unique identifier
                    }).indexes();
                    if (rowIdx.length > 0) { // Check if the row was actually found
                        var cell = table.cell(rowIdx[0], parseInt(colIdx)); // Use first matching row
                        if (cell.node()) { // Check if the cell exists
                            cell.data(value);
                        }
                    }
                });
            });

            // Redraw the table to apply the edits visually without resetting pagination
            table.draw(false);

            // Reselect previously selected rows after the table data has been reloaded and edits reapplied
            selectedIDs.forEach(function(id) {
                table.rows(function(idx, data, node) {
                    return data.id.toString() === id;
                }).select();
            });

            // Check checkboxes for selected rows
            table.rows('.selected').every(function(rowIdx, tableLoop, rowLoop) {
                $(this.node()).find('input[type="checkbox"]').prop('checked', true);
            });

            // Reset the page only after the data, edits, and selection have been reapplied
            table.page(currentPage).draw(false);
        }, false);
    }
}, 10000);  // Refresh every 10 seconds
    
    
  //---ONCLICK LISTENERS --------------------------------//
// Event handler for 'Select All' checkbox to select/deselect all rows across all pages
$('#sensorData thead').on('click', 'input#selectAll', function(e) {
    var isChecked = this.checked;

    // Check or uncheck all visible checkboxes in the tbody
    $('#sensorData tbody input[type="checkbox"]').prop('checked', isChecked);

    // Trigger change event on individual checkboxes if needed
    $('#sensorData tbody input[type="checkbox"]').each(function() {
        $(this).trigger('change');
    });

    // Prevent default action and propagation
    e.stopPropagation();
});

// On individual checkbox change
$('#sensorData tbody').on('change', 'input[type="checkbox"]', function() {
    var allChecked = $('#sensorData tbody input[type="checkbox"]').length === $('#sensorData tbody input[type="checkbox"]:checked').length;
    $('#selectAll').prop('checked', allChecked);
    updateButtonStates();
});

// Ensure that the state of the header checkbox is preserved across page navigation
$('#sensorData').on('page.dt', function () {
    // Update 'Select All' checkbox state when navigating pages
    var allChecked = $('#sensorData tbody input[type="checkbox"]:checked').length === $('#sensorData tbody input[type="checkbox"]').length;
    $('#selectAll').prop('checked', allChecked);
});

// Deselect all rows when clicking anywhere outside the table
$(document).on('click', function(e) {
    if (!$(e.target).closest('#sensorData').length) {
        $('#sensorData tbody tr.selected').removeClass('selected').find('input[type="checkbox"]').prop('checked', false);
        $('#selectAll').prop('checked', false);
    }
});

  //Click event for table rows
$('#sensorData tbody').on('click', 'input[type="checkbox"]', function(e) {
    var $row = $(this).closest('tr');
    var index = $row.index();
    var isCtrlPressed = e.ctrlKey || e.metaKey;
    var isShiftPressed = e.shiftKey;

    // Prevent default action to handle selection manually
    e.stopPropagation();

    if (!isCtrlPressed && !isShiftPressed) {
        $('#sensorData tbody tr.selected').not($row).removeClass('selected');
        $row.toggleClass('selected');
        firstClickedIndex = index; // Set or reset the first index
    } else if (isShiftPressed) {
        if (firstClickedIndex !== null) {
            $('#sensorData tbody tr').removeClass('selected'); // Reset selection
            var start = Math.min(firstClickedIndex, index);
            var end = Math.max(firstClickedIndex, index);
            $('#sensorData tbody tr').slice(start, end + 1).addClass('selected');
        }
    } else if (isCtrlPressed) {
        $row.toggleClass('selected');
        // Reset firstClickedIndex only if no row is selected
        if (!$('#sensorData tbody tr').hasClass('selected')) {
            firstClickedIndex = null;
        }
    }

    // Update checkbox status based on row selection
    $('#sensorData tbody tr').each(function() {
        var isSelected = $(this).hasClass('selected');
        $(this).find('input[type="checkbox"]').prop('checked', isSelected);
    });
});

// To retain Ctrl and Shift functionality without direct clicks, this part remains unchanged
$('#sensorData tbody').on('click', 'tr', function(e) {
    if (!$(e.target).is('input[type="checkbox"]')) {
        e.stopPropagation(); // Prevent triggering the checkbox click event
    }
});

// Deselect all rows when clicking outside the table and uncheck the checkboxes
$(document).on('click', function(e) {
    if (!$(e.target).closest('#sensorData').length) {
        $('#sensorData tbody tr.selected').removeClass('selected');
        // Uncheck all checkboxes in the table
        $('#sensorData tbody tr').find('input[type="checkbox"]').prop('checked', false);
        firstClickedIndex = null; // Also reset on clicking outside
        updateButtonStates(); // Update the state of the edit and delete buttons
    }
});

//Listener for checkbox
$('#sensorData tbody').on('change', '.dt-checkbox', function(e) {
    var $row = $(this).closest('tr');
    if (this.checked) {
        $row.addClass('selected');
    } else {
        $row.removeClass('selected');
    }
    // Prevent further propagation to avoid triggering row selection directly.
    e.stopPropagation();
});

// Function to delete selected rows
$('#deleteButton').on('click', function() {
    var selectedRows = table.rows('.selected').data();
    var numberOfRowsToDelete = selectedRows.length;

    if (numberOfRowsToDelete === 0) {
        // Show Bootstrap alert for no rows selected
        $('#noRowsAlert').fadeIn().delay(5000).fadeOut(); // Simplified alert handling
        return;
    }

    // Show Bootstrap modal for confirmation
    $('#deleteConfirmationModal').modal('show');
    
    // Store the indexes of selected rows
    var selectedRowIndexes = table.rows('.selected').indexes();

    $('#confirmDeleteButton').on('click', function() {
        var deletedRowIds = JSON.parse(localStorage.getItem('deletedRowIds') || '[]'); // Retrieve existing deleted IDs
        
        $.each(selectedRows, function(index, row) {
            deletedRowIds.push(row.id); // Assuming 'id' is part of your row data
        });

        localStorage.setItem('deletedRowIds', JSON.stringify(deletedRowIds)); // Store updated IDs

        table.rows('.selected').remove().draw(false); // Remove rows visually from DataTable

        // Reapply selection after deletion
        table.rows(selectedRowIndexes).select();

        // Hide modal after deletion
        $('#deleteConfirmationModal').modal('hide');

        table.rows('.selected').remove().draw(false);
        updateButtonStates();
    });
});

$(document).on('click', '#deleteButton', function(event) {
    event.stopPropagation();  // This should prevent row deselection when clicking the delete button
});

//Event for Inline editor function
$('#sensorData tbody').on('click', 'td', function() {
    var $cell = $(this);
    var cell = table.cell(this);
    var columnIdx = cell.index().column;

      if (columnIdx === 0 || $(this).find('input, select').length) return; // Skip first column and already edited cells

    closeExistingEditors($cell.closest('table'));

    var originalContent = cell.data();
    if (columnIdx === 2) {
        var $input = $('<input>', {
            type: 'text',
            value: originalContent,
            style: 'width: 100%'
        }).appendTo($cell.empty()).focus();

        flatpickr($input[0], {
            enableTime: true,
            enableSeconds: true,
            dateFormat: "Y-m-d H:i:S",
            onClose: function(selectedDates, dateStr) {
                if(dateStr !== originalContent) {
                    saveEdit(cell.index().row, columnIdx, dateStr);
                }
                cell.data(dateStr).draw(false);
            }
        });
    } else {
        var $input = $('<input>', {
            type: 'text',
            value: originalContent,
            style: 'width: 100%'
        }).appendTo($cell.empty()).focus();

        $input.on('blur keydown', function(e) {
            if (e.type === 'blur' || e.key === 'Enter' || e.key === 'Escape') {
                var newValue = $(this).val();
                if(newValue !== originalContent) {
                    saveEdit(cell.index().row, columnIdx, newValue);
                }
                cell.data(newValue).draw(false);
            }
        });
    }
});

// Dropdown toggle
    $('#dropdownMenuButton').on('click', function (event) {
        event.stopPropagation(); // Prevent event from bubbling up
        $(this).next('.dropdown-menu').toggle(); // Toggle only the adjacent dropdown menu
    });

    $('#dropdownMenuButton1').on('click', function (event) {
        event.stopPropagation(); // Prevent event from bubbling up
        $(this).next('.dropdown-menu1').toggle(); // Toggle only the adjacent dropdown menu

    });

    // Close the dropdown menu if clicked outside
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.dropdown').length) {
            $('.dropdown-menu').hide(); // Hide the dropdown menu
        }
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.dropdown1').length) {
            $('.dropdown-menu1').hide(); // Hide the dropdown menu
        }
    });

    // Export option listeners
    $('#exportCsv, #exportSQL, #exportTXT').on('click', function() {
        var selectedRows = table.rows('.selected').data();
        var totalRows = table.rows().data().length;
    
        // Prevent the export and download if no rows are selected or if the table is empty
        if (totalRows === 0) {
            showAlert('The table is empty. No data to export.', 'warning');
            return; // Prevent further execution
        } else if (selectedRows.length === 0) {
            showAlert('Please select at least one row to export.', 'warning');
            return; // Prevent further execution
        }
    
        // Proceed with the export if the table is not empty and rows are selected
        var exportType = $(this).attr('id').replace('export', '').toUpperCase();
        // Determine the correct function based on the export type
        var dataToExport = '';
        switch (exportType) {
            case 'CSV':
                dataToExport = exportToCSV(); // Assume these functions return the data as a string
                break;
            case 'SQL':
                dataToExport = exportToSQL();
                break;
            case 'TXT':
                dataToExport = exportToTXT();
                break;
            default:
                showAlert('Export for ' + exportType + ' format not implemented.', 'warning');
                return;
        }
        
        if (dataToExport) {
            // Only if dataToExport is not an empty string, initiate the download
            var mimeType = 'text/plain'; // Adjust based on format
            var fileName = `exportedData.${exportType.toLowerCase()}`;
            downloadFile(dataToExport, fileName, mimeType);
        }
    });

// Event handler for hiding the  columns
        $('#Humidity').on('click', function(e) {
            e.preventDefault();
            // Toggle the visibility of the Humidity column (index 1)
            var column = table.column(3);
            column.visible(!column.visible());
        });

      $('#AirTemp').on('click', function(e) {
        e.preventDefault();
        var column = table.column(4); // Adjust the index for Air Temperature
        column.visible(!column.visible());
    });

    $('#SoilTemp').on('click', function(e) {
        e.preventDefault();
        var column = table.column(5); // Adjust the index for Soil Temperature
        column.visible(!column.visible());
    });

    $('#Moist').on('click', function(e) {
        e.preventDefault();
        var column = table.column(6); // Adjust the index for Soil Moisture
        column.visible(!column.visible());
    });

    $('#pH').on('click', function(e) {
        e.preventDefault();
        var column = table.column(7); // Adjust the index for pH
        column.visible(!column.visible());
    });

//---  FUNCTIONS --------------------------------

      // Function to check if the table is empty
    function isTableEmpty() {
        return $('#sensorData').DataTable().data().count() === 0;
    }

    // Assuming a unique characteristic, such as a combination of values, can identify rows
        function getRowIdentifier(rowData) {
            return rowData.join('-'); // Adjust based on your row data structure
        }

    //Function for in-line editing
    function closeExistingEditors(table) {
        $(table).find('input, select').each(function() {
            var $input = $(this);
            if($input.attr('type') !== 'checkbox') { // Exclude checkboxes
                var cell = $input.closest('td');
                var value = $input.val();
                cell.text(value); // Set the text of the cell directly
                $input.remove();
            }
        });
    }

    function saveEdit(rowIdx, colIdx, newValue) {
        let rowData = table.row(rowIdx).data();
        let edits = JSON.parse(localStorage.getItem('dataTableEdits') || '{}');
        if (!edits[rowData.id]) { // Assuming rowData contains a unique 'id' for each row
            edits[rowData.id] = {};
        }
        edits[rowData.id][colIdx] = newValue;
        localStorage.setItem('dataTableEdits', JSON.stringify(edits));
    }

    function reapplyEdits(table) {
        var edits = JSON.parse(localStorage.getItem('dataTableEdits') || '{}');
        Object.entries(edits).forEach(([rowId, colValues]) => {
            Object.entries(colValues).forEach(([colIdx, value]) => {
                var rowIndex = table.rows().indexes().filter(idx => table.row(idx).data().id == rowId);
                if (rowIndex.length > 0) {
                    var cell = table.cell(rowIndex[0], parseInt(colIdx));
                    if (cell.node()) { // Make sure cell exists
                        cell.data(value);
                    }
                }
            });
        });
        table.draw(false); // Redraw the table to apply the edits visually
    }

    function showAlert(message, type) {
        var alertHtml = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">` +
                        `${message}` +
                        `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>` +
                        `</div>`;
        $('#alertPlaceholder').html(alertHtml);
        $('#alertPlaceholder').fadeIn();
    
        setTimeout(function() {
            $('#alertPlaceholder').fadeOut();
        }, 5000);
    }

    function exportTableData(exportType) {
        var dataToExport = '';
    
        if (exportType === 'CSV') {
            dataToExport = exportToCSV();
            downloadFile(dataToExport, 'exportedData.csv', 'text/csv;charset=utf-8;');
        } else if (exportType === 'SQL') {
            dataToExport = exportToSQL();
            downloadFile(dataToExport, 'exportedData.sql', 'application/sql');
        } else if (exportType === 'TXT') {
            dataToExport = exportToTXT();
            downloadFile(dataToExport, 'exportedData.txt', 'text/plain');
        } else {
            alert('Export for ' + exportType + ' format not implemented.');
        }
    }
    
    function exportToCSV() {
        var csv = '';
        // Extract headers
        $('#sensorData thead tr th:not(:first-child)').each(function() {
            csv += '"' + $(this).text().trim() + '",';
        });
        csv = csv.slice(0, -1); // Remove the last comma
        csv += "\r\n";
    
        // Extract data from each selected row, excluding the first cell (checkbox)
        $('#sensorData tbody tr.selected').each(function() {
            $(this).find('td:not(:first-child)').each(function() {
                // Extract and format cell text
                var text = $(this).text().trim();
                text = text.replace(/"/g, '""'); // Escape double quotes
                csv += '"' + text + '",';
            });
            csv = csv.slice(0, -1); // Remove the last comma
            csv += "\r\n";
        });
    
        return csv;
    }
    
    function exportToSQL() {
    var sql = '';
    var tableName = $('#sensorData').DataTable();; // Adjust table name as needed
    // Column names based on the headers (skip the checkbox column)
    var columnNames = [];
    $('#sensorData thead tr th:not(:first-child)').each(function() {
        columnNames.push($(this).text().trim());
    });

    // Construct SQL for each selected row
    $('#sensorData tbody tr.selected').each(function() {
        var values = [];
        $(this).find('td:not(:first-child)').each(function() {
            var text = $(this).text().trim().replace(/'/g, "''"); // Escape single quotes for SQL
            values.push("'" + text + "'");
        });
        sql += `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${values.join(', ')});\n`;
    });

    return sql;
}
  
function exportToTXT() {
    var txt = '';
    // Headers
    $('#sensorData thead tr th:not(:first-child)').each(function() {
        txt += $(this).text().trim() + '\t';
    });
    txt = txt.trim() + "\n";

    // Data rows
    $('#sensorData tbody tr.selected').each(function() {
        $(this).find('td:not(:first-child)').each(function() {
            txt += $(this).text().trim() + '\t';
        });
        txt = txt.trim() + "\n";
    });

    return txt;
}

    function downloadFile(data, filename, type) {
        var file = new Blob([data], {type: type});
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
    
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }

    function updateButtonStates() {
        var anyRowSelected = $('#sensorData tbody input[type="checkbox"]:checked').length > 0;
        $('#editButton').prop('disabled', !anyRowSelected);
        $('#deleteButton').prop('disabled', !anyRowSelected);
    }

    window.addEventListener('beforeunload', function() {
        var currentPage = table.page.info().page; // Get current page number
        localStorage.setItem('dataTableCurrentPage', currentPage);
    });
 
    // When the Edit button is clicked, open the modal for the selected row
    $('#editButton').on('click', function() {
        var selectedRows = table.rows('.selected').data();

        if (selectedRows.length === 0) {
            var alertHtml = '<div class="alert alert-warning alert-dismissible fade show" role="alert">' +
                        'Please select a row to edit.' +
                        '<button type="button" class="btn-close" style="background-color: inherit; color: inherit; border: none;" data-bs-dismiss="alert" aria-label="Close"></button>' +
                        '</div>';
            $('#alertPlaceholder').html(alertHtml); // Assuming you have a placeholder div for alerts
            
            // Set a timeout to remove the alert after 5 seconds
            setTimeout(function() {
                $('#alertPlaceholder').fadeOut(); // Use Bootstrap's .alert('close') method
            }, 5000); // Time in milliseconds (5000ms = 5s)
            
            return;
        }

        if (selectedRows.length > 1) {
            var alertHtml = '<div class="alert alert-warning alert-dismissible fade show" role="alert">' +
                        'Please select only one row to edit.' +
                        '<button type="button" class="btn-close" style="background-color: inherit; color: inherit; border: none;" data-bs-dismiss="alert" aria-label="Close"></button>' +
                        '</div>';
            $('#alertPlaceholder').html(alertHtml); // Assuming you have a placeholder div for alerts
            
            // Set a timeout to remove the alert after 5 seconds
            setTimeout(function() {
                $('#alertPlaceholder').fadeOut(); // Use Bootstrap's .alert('close') method
            }, 5000); // Time in milliseconds (5000ms = 5s)
            
            return;
        }

        var rowData = selectedRows[0]; // Assuming rowData is in the same order as the modal fields

        if (selectedRows.length === 1) {
            // Populate the form fields with the selected row's data
            $('#editTimestamp').val(rowData['timestamp']);
            $('#editHumidity').val(rowData['air_humidity']); 
            $('#editAirTemp').val(rowData['air_temperature']);
            $('#editSoilTemp').val(rowData['soil_temperature']);
            $('#editSoilMoist').val(rowData['soil_moisture_3in1']);
            $('#editSoilPH').val(rowData['soil_pH']);

            // Storing the index of the editing row for updating it later
            $('#editModal').data('rowIndex', table.row('.selected').index());

            // Initialize flatpickr for the timestamp input field
            flatpickr('#editTimestamp', {
                enableTime: true,
                enableSeconds: true,
                dateFormat: "Y-m-d H:i:S",
                onClose: function(selectedDates, dateStr) {
                    // This function will be called when the date picker is closed
                    // You can add any additional logic here if needed
                }
            });

            $('#editModal').modal('show');

        }
    });

    $('#saveChanges').on('click', function() {
        var rowIndex = $('#editModal').data('rowIndex');
        console.log('Modal Save Changes: row index', rowIndex); // Debugging
    
        var rowData = table.row(rowIndex).data();
        console.log('Modal Save Changes: original rowData', rowData); // Debugging
        
        var updatedData = {
            timestamp: $('#editTimestamp').val(),
            air_humidity: $('#editHumidity').val(),
            air_temperature: $('#editAirTemp').val(),
            soil_temperature: $('#editSoilTemp').val(),
            soil_moisture_3in1: $('#editSoilMoist').val(),
            soil_pH: $('#editSoilPH').val()
        };
        console.log('Modal Save Changes: updated data from modal', updatedData); // Debugging
    
        let edits = JSON.parse(localStorage.getItem('dataTableEdits') || '{}');
        console.log('Modal Save Changes: current edits from localStorage before update', edits); // Debugging
    
        for (let key in updatedData) {
            if (updatedData[key] !== rowData[key]) {
                console.log(`Modal Save Changes: updating ${key} from ${rowData[key]} to ${updatedData[key]}`); // Debugging
                
                rowData[key] = updatedData[key];
                let colIdx = table.column(`${key}:name`).index();
                if (colIdx !== undefined) {
                    console.log(`Modal Save Changes: saving edit for column ${key} at index ${colIdx}`); // Debugging
                    saveEdit(rowIndex, colIdx, updatedData[key]);
                    edits[rowData.id][colIdx] = updatedData[key];
                } else {
                    console.error(`Modal Save Changes: Column index for ${key} is undefined`); // Debugging error
                }
            }
        }
        
        table.row(rowIndex).data(rowData).draw(false);
        localStorage.setItem('dataTableEdits', JSON.stringify(edits));
        console.log('Modal Save Changes: final edits saved to localStorage', edits); // Debugging
    
        $('#editModal').modal('hide');
        updateButtonStates();
    });
    
    

    // Prevent deselection when clicking on buttons or outside the DataTables
    $(document).on('click', '#editButton', function(event) {
        event.stopPropagation();  // This should prevent row deselection when clicking the edit button
    });

    $('#sensorData tbody').on('click', 'tr', function(event) {
        if (!$(event.target).is('input[type="checkbox"]')) {
            // If the click is not directly on a checkbox, do nothing.
            return;
        }
        if($(event.target).is('input[type="checkbox"], button, a, .dropdown, .dropdown-menu')) {
            // event.stopPropagation();  // Prevent toggling 'selected' class when clicking these elements
            return;
        }
        $(this).toggleClass('selected');
        updateButtonStates(); // Update the state of the edit and delete buttons

    });

    $('#editModal, #deleteConfirmationModal').on('hidden.bs.modal', function () {
        // This event is triggered when a modal is completely hidden
        updateButtonStates(); // Update the state of the edit and delete buttons
    });
    

});

