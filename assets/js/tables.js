$(document).ready(function() {

//--TABLE CONFIGURATION-------------------------//

//Global Variables
  var isEditing = false;
  var currentInput;  
  var firstClickedIndex = null;
   var lastId = localStorage.getItem('lastId') ? parseInt(localStorage.getItem('lastId'), 10) : 0;

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
        { "data": null, "defaultContent": '', "title": '<input type="checkbox" id="selectAll">', "orderable": false }, // Checkbox column
        { "data": "id", "visible": false },
        { "data": "timestamp" },
        { "data": "air_humidity" },
        { "data": "air_temperature" },
        { "data": "soil_temperature" },
        { "data": "soil_moisture_3in1" },
        { "data": "soil_pH" }
    ],
    rowReorder: true,
   "initComplete": function() {
        // Existing code for retrieving the saved page number
        var savedPage = localStorage.getItem('dataTableCurrentPage');
        if (savedPage !== null) {
            this.api().page(parseInt(savedPage)).draw('page');
        }
    
        // New code to reapply saved edits
        var edits = JSON.parse(localStorage.getItem('dataTableEdits') || '{}');
        Object.entries(edits).forEach(([rowId, colValues]) => {
            Object.entries(colValues).forEach(([colIdx, value]) => {
                // Find the cell using rowId and colIdx and set its data
                var cell = this.api().cell(rowId, colIdx);
                if (cell.node()) { // Check if cell exists
                    cell.data(value);
                }
            });
        });
    
        // Redraw the table to apply the edits visually without resetting pagination
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
        if (!isEditing) {
            var currentPage = table.page();
            table.ajax.reload(function() {
                table.page(currentPage).draw(false);
            }, false);
        }
    }, 10000); // Adjust as necessary for your data refresh rate // 10 seconds refresh rate

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
    var deletedRowIds = [];
    var selectedRows = table.rows('.selected').data();
    var numberOfRowsToDelete = selectedRows.length;

    if (numberOfRowsToDelete === 0) {
        alert('No rows selected to delete.');
        return;
    }

    var confirmDelete = confirm(`Are you sure you want to delete ${numberOfRowsToDelete} row(s)?`);
    if (!confirmDelete) {
        return; // User cancelled the deletion
    }

    var deletedRowIds = JSON.parse(localStorage.getItem('deletedRowIds') || '[]'); // Retrieve existing deleted IDs

    $.each(selectedRows, function(index, row) {
        deletedRowIds.push(row.id); // Assuming 'id' is part of your row data
    });

    localStorage.setItem('deletedRowIds', JSON.stringify(deletedRowIds)); // Store updated IDs

    table.rows('.selected').remove().draw(false); // Remove rows visually from DataTable
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
        $('.dropdown-menu').toggle(); // Toggles the visibility of the dropdown menu
    });

    $('#dropdownMenuButton1').on('click', function (event) {
        $('.dropdown-menu1').toggle(); // Toggles the visibility of the dropdown menu
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
        console.log("Export button clicked"); // Debugging line
        if (isTableEmpty()) {
            alert('The table is empty. No data to export.');
            return; // Stop the function if the table is empty
        }

        var exportType = $(this).attr('id').replace('export', '').toUpperCase(); // Get the export type (CSV, SQL, TXT)
        console.log('Exporting:', exportType); // Debugging line to check which export type is selected
        exportTableData(exportType); // Call the export function with the determined type
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

    function saveEdit(rowId, colIdx, newValue) {
        let edits = JSON.parse(localStorage.getItem('dataTableEdits') || '{}');
        if (!edits[rowId]) edits[rowId] = {};
        edits[rowId][colIdx] = newValue;
        localStorage.setItem('dataTableEdits', JSON.stringify(edits));
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
        var table = $('#sensorData').DataTable();
    
        // Get headers
        $('#sensorData thead tr th').each(function() {
            csv += '"' + $(this).text() + '",';
        });
        csv = csv.slice(0, -1); // Remove last comma
        csv += "\r\n";
    
        // Get table data for displayed rows only
        table.$('tr', {"filter":"applied"}).each(function() {
            $('td', this).each(function() {
                var cellData = $(this).text();
                // Escape double quotes in cell data
                csv += '"' + cellData.replace(/"/g, '""') + '",';
            });
            csv = csv.slice(0, -1); // Remove the last comma
            csv += "\r\n";
        });
    
        return csv;
    }
    
    function exportToSQL() {
        var sql = '';
        var table = $('#sensorData').DataTable();
    
        // Generate SQL for displayed rows only
        table.$('tr', {"filter":"applied"}).each(function() {
            sql += 'INSERT INTO your_table_name (Timestamp, Humidity, Air Temperature, Soil Temperature, Soil Moisture, pH) VALUES (';
            $('td', this).each(function(index) {
                // Properly format and escape the value based on its type
                var value = $(this).text();
                // Assuming all values are strings or numbers, adjust as necessary
                value = isNaN(value) ? "'" + value.replace(/'/g, "''") + "'" : value;
                sql += index > 0 ? ', ' + value : value;
            });
            sql += ");\n";
        });
    
        return sql;
    }    
    
    function exportToTXT() {
        var txt = '';
        var table = $('#sensorData').DataTable();
    
        // Get headers
        $('#sensorData thead tr th').each(function() {
            txt += $(this).text() + '\t';
        });
        txt = txt.trim() + "\n";
    
        // Generate TXT for displayed rows only
        table.$('tr', {"filter":"applied"}).each(function() {
            $('td', this).each(function() {
                var cellData = $(this).text();
                txt += cellData + '\t';
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

    window.addEventListener('beforeunload', function() {
        var currentPage = table.page.info().page; // Get current page number
        localStorage.setItem('dataTableCurrentPage', currentPage);
    });
      
});

// Add an event listener for the unload event
window.addEventListener('unload', function(event) {
    // Check if the target URL is within the same website
    if (isSameWebsite(event.currentTarget.location.href)) {
      // Perform cleanup tasks or other actions specific to navigation within the same website
      console.log("Navigating within the same website");
    } else {
      // Perform cleanup tasks or other actions specific to leaving the website
      console.log("Leaving the website");
      localStorage.clear(); // Clear Local Storage when leaving the website
    }
  });

