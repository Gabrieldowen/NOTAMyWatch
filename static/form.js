$(document).ready(function () {
    $('.datetimepicker').datetimepicker({
        format: 'Y-m-d H:i:s',
        autoclose: true,
        todayHighlight: true,
	keyboardNavigation: false,
	forceParse: false,
    });
});

var destinationCounter = 2;

function addDestination() {
  
  var additionalDestinationsDiv = document.getElementById('additionalDestinations');

  // Create a new destination row
  var destinationRow = document.createElement('div');
  destinationRow.classList.add('row');
  // Added an ID for the row, for easy deletion afterwards.
  destinationRow.id = 'row' + destinationCounter;

  var destinationInput = document.createElement('div');
  destinationInput.classList.add('col-md-6', 'mb-3');
  destinationInput.innerHTML = '<label for="destinationLocation' + destinationCounter + '" class="form-label" id="destinationLocationText' + destinationCounter + '"><strong>Destination ' + destinationCounter + '</strong></label>' +
    '<input type="text" class="form-control" id="destinationLocation' + destinationCounter + '" name="destinationLocation' + destinationCounter + '" oninput="updateAirportOptions(\'destinationLocation' + destinationCounter + '\', \'destinationLocationDropdown' + destinationCounter + '\')" onclick="updateAirportOptions(\'destinationLocation' + destinationCounter + '\', \'destinationLocationDropdown' + destinationCounter + '\')">' +
    '<div class="dropdown" id="destinationLocationDropdown' + destinationCounter + '" ></div>';
  destinationInput.id = 'destinationLocationR' + destinationCounter;
  
  // Checking to see if there is a button needed for deleting.
  if (destinationCounter >= 3){
    var lastDestButtonId = 'deleteButton' + (destinationCounter - 1);
    document.getElementById(lastDestButtonId).remove();
    lastDestButtonId.onclick = null;
  }
  
  // Create the button to delete the current row.
  var destinationDelete = document.createElement('button');
  destinationDelete.id = 'deleteButton' + destinationCounter;
  destinationDelete.className = 'delete';
  destinationDelete.type = 'button';
  destinationDelete.onclick = function() {
    deleteDestination(destinationRow.id);
  };

  destinationRow.appendChild(destinationInput);
  additionalDestinationsDiv.appendChild(destinationRow);

  // Create an error message child for the new destination.
  var destinationErrorMsg = document.createElement('span');
  destinationErrorMsg.style.cssText =  'position: relative; bottom: 20px;'
  destinationErrorMsg.id = 'error-message' + (destinationCounter + 3);

  // Get the last destination location input in the row
  var lastDestinationLocationInput = additionalDestinationsDiv.lastChild.lastElementChild;

  // Insert the error message span right after the last destination location input
  lastDestinationLocationInput.insertAdjacentElement('afterend', destinationErrorMsg);

  // Add the button.
  var destText = additionalDestinationsDiv.querySelector('#' + 'destinationLocationText' + destinationCounter);
  destText.insertAdjacentElement('beforeend', destinationDelete);
  
  // Increment the destination counter for the next input
  destinationCounter++;

}

// Function to delete additional destinations not needed anymore. Basically getting the previous row id and last 
// element of the previous row id, and adding a button to that one.
function deleteDestination(inputId){
  
  destinationCounter--;
  
  document.getElementById(inputId).remove();

  if (destinationCounter != 2){
    
    let destinationRow = document.getElementById('row' + (destinationCounter - 1));

    let destText = document.getElementById('additionalDestinations').querySelector('#' + 'destinationLocationText' + (destinationCounter - 1));

    // Create a button to delete this destination if needed so.
    let destinationDelete = document.createElement('button');
    destinationDelete.id = 'deleteButton' + (destinationCounter - 1);
    destinationDelete.className = 'delete';
    destinationDelete.type = 'button';
    destinationDelete.onclick = function() {
      deleteDestination(destinationRow.id);
    };

    destText.insertAdjacentElement('beforeend', destinationDelete);
  }
}

function updateAirportOptions(inputId, dropdownId) {
    var inputElement = document.getElementById(inputId);
    var dropdownElement = document.getElementById(dropdownId);

    // Convert input to uppercase for case-insensitive matching
    var userInput = inputElement.value.toUpperCase();

    // Clear existing options
    dropdownElement.innerHTML = '';

    // Recursive function to traverse the nested structure
    function traverse(obj) {
	var options = [];

	function addOption(node) {
		var option = document.createElement('div');
		option.className = 'dropdown-option';
		option.textContent = `${node.iata} - ${node.name}`;
		option.addEventListener('click', function() {
			inputElement.value = this.dataset.airportCode;
			dropdownElement.style.display = 'none';
		});
		option.dataset.airportCode = node.iata;
		options.push(option);
	}

	for (var key in obj) {
		if (obj.hasOwnProperty(key) && key !== 'name' && key !== 'country') {
			var node = obj[key];

			if (node.hasOwnProperty('airports')) {
				traverse(node.airports);
			} else {
				if (node.iata.includes(userInput) || node.name.toUpperCase().includes(userInput)) {
					addOption(node);
				}
			}
		}
	}

	// Sort the options alphabetically by airport name
	options.sort(function(a, b) {
		return a.textContent.localeCompare(b.textContent);
	});

	// Append sorted options to the dropdown
	options.forEach(function(option) {
		dropdownElement.appendChild(option);
	});
    }

    // Start the recursive traversal from the root
    traverse(airportIATA);

    // Show the dropdown
    dropdownElement.style.display = 'block';
}

// Closes the dropdown when clicking outside
document.addEventListener('click', function (event) {
    var dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(function (dropdownElement) {
        if (!event.target.closest('.custom-dropdown')) {
            dropdownElement.style.display = 'none';
        }
    });
});

// Function to reset the body of the page and change it to loading.
function submitForm() {
  // Store the form data.
  const formData = new FormData(document.getElementById('dataForm'));

  // Remove all the text and input boxes
  document.getElementById('Title').remove();

  document.getElementById('effectiveStartDate').remove();
  document.querySelector('label[for="effectiveStartDate"]').remove();

  document.getElementById('effectiveEndDate').remove();
  document.querySelector('label[for="effectiveEndDate"]').remove();
      
  document.getElementById('radius').remove();
  document.querySelector('label[for="radius"]').remove();

  document.getElementById('pathWidth').remove();
  document.querySelector('label[for="pathWidth"]').remove();
      
  document.getElementById('sortOrder').remove();
  document.querySelector('label[for="sortOrder"]').remove();
      
  document.getElementById('sortBy').remove();
  document.querySelector('label[for="sortBy"]').remove();
      
  document.getElementById('startAirport').remove();
  document.querySelector('label[for="destAirport"]').remove();
      
  document.getElementById('destAirport').remove();
  document.querySelector('label[for="startAirport"]').remove();

  for (let i = 2; i <= 4; i++) {
      document.getElementById('destinationLocation' + i);
  }
  document.getElementById('submitButton').remove();
  document.getElementById('addButton').remove();
  document.getElementById('additionalDestinations').remove();
    
  // Remove all the additional destinations
  
  var hiddenElements = document.querySelectorAll('.hiddenObj');

  // Display loading text for the user.
  hiddenElements.forEach(function (element) {
      element.style.display = 'block';
  });

  // Call the server with the data provided.
  fetch(document.getElementById('dataForm').action, {
      method: 'POST',
      body: formData,
  })
  
  // Update the display page after the call to the server is done.
  .then(response => response.text())
  .then(data => {
      // Replace the entire body with the new content
      document.body.innerHTML = data;
  })
  // Error catching just in case
  .catch(error => console.error('Error:', error))
  .finally(() => {
      // Hide loading elements
      hiddenElements.forEach(function (element) {
          element.style.display = 'none';
      });
  });
  
}

// Function called to check if the airports are of the correct form.
function checkInputAirport(inputId, errorMsg) {
  const inputElement = document.getElementById(inputId);
  const errorMessage = document.getElementById(errorMsg);

  // Use the regular expression pattern ^[A-Z]{3}$ to match three uppercase letters
  const pattern = /^[A-Z]{3}$/;

  // Check if the entered string matches the pattern
  if (!pattern.test(inputElement.value)) {
      errorMessage.textContent = 'Invalid airport. Please enter a valid airport.';
      return false;
  } else if (inputElement.value !== ''){
      errorMessage.textContent = '';
      return true;
  }

}

// Function to check for a leap year month.
function getLastDayOfMonth(year, month){
  if (month === 1 && ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0))) {
      // February in a leap year
      return 29;
  } else {
      // The rest of the months
      return new Date(year, month + 1, 0).getDate();
  }
}

// Function called to check if the dates are of the correct form.
function checkInputDate(input, errorMsg) {
  // Get the current day and time. Unused because not sure of date range our algorithm will accept.
  const currentDate = new Date();
  
  const dateTimeInput  = document.getElementById(input).value;
  const errorMessage = document.getElementById(errorMsg);
  
  const [datePart, timePart] = dateTimeInput.split(' ');
  if (datePart === '' || datePart === undefined || timePart === '' || timePart === undefined){
    errorMessage.textContent = 'Invalid date or time. Please enter a valid date and time (YYYY-MM-DD hh:mm:ss).';
    return false;
  }
  const dateArray = datePart.split('-');
  const timeArray = timePart.split(':');

  const year = parseInt(dateArray[0], 10);
  const month = parseInt(dateArray[1], 10);
  const day = parseInt(dateArray[2], 10);

  const hours = parseInt(timeArray[0], 10);
  const minutes = parseInt(timeArray[1], 10);
  const seconds = parseInt(timeArray[2], 10);

  // Check if the entered date and time are valid
  if (
    month >= 1 && month <= 12 &&
    day >= 1 && day <= getLastDayOfMonth(year, month) &&
    year >= 2020 && year <= 2030 &&
    hours >= 0 && hours <= 23 &&
    minutes >= 0 && minutes <= 59 &&
    seconds >= 0 && seconds <= 59
  ) {
      errorMessage.textContent = ''; // Clear any previous error message
      return true;
  } else {
      errorMessage.textContent = 'Invalid date or time. Please enter a valid date and time (YYYY-MM-DD hh:mm:ss).';
      return false;
  }
}

// Function to check the inputted radius for the NOTAMs, right now it is 0 to 100, accepting only integers.
function checkInputRadius(inputId, errorMsg){
  const inputElement = document.getElementById(inputId);
  const errorMessage = document.getElementById(errorMsg);

  // Check if the input are all digits.
  const regex = /^\d+$/;
  let areDigits = regex.test(inputElement.value);

  if(!areDigits){
    errorMessage.textContent = 'Please enter a valid radius between 0 and 100 (Integers).';
    return false;
  }

  // Get the entered value and convert it to an integer
  let inputValue = parseFloat(inputElement.value, 10);
  // Check the pathWidthVal before checking if the radius is within the range.
  let pathWidthVal = parseFloat(document.getElementById('pathWidth').value, 10);

  if (Number.isInteger(inputValue) && Number.isInteger(pathWidthVal) && inputValue <= (pathWidthVal/2)){
    errorMessage.textContent = 'Radius needs to be greater than half the path width.';
    return false;
  }

  // Check if the entered value is a valid integer within the specified range
  if (Number.isInteger(inputValue) && inputValue >= 0 && inputValue <= 100) {
      // Valid input
      errorMessage.textContent = ''; // Clear any previous error message
      return true;
  } else {
      errorMessage.textContent = 'Please enter a valid radius between 0 and 100 (Integers).';
      return false;
  }
}

// Function to check the inputted path width for the NOTAMs, right now it is 0 to 50, accepting only integers.
function checkInputPathWidth(inputId, errorMsg){
  const inputElement = document.getElementById(inputId);
  const errorMessage = document.getElementById(errorMsg);

  // Check if the input are all digits.
  const regex = /^\d+$/;
  let areDigits = regex.test(inputElement.value);

  if(!areDigits){
    errorMessage.textContent = 'Please enter a valid path width between 0 and 50 (Integers).';
    return false;
  }

  // Get the entered value and convert it to an integer
  const inputValue = parseInt(inputElement.value, 10);

  // Check if the entered value is a valid integer within the specified range
  if (Number.isInteger(inputValue) && inputValue >= 0 && inputValue <= 50) {
      // Valid input
      errorMessage.textContent = ''; // Clear any previous error message
      return true;
  } else {
      errorMessage.textContent = 'Please enter a valid path width between 0 and 50 (Integers).';
      return false;
  }
}

function checkInputIsNotEmpty(inputId){
  if (document.getElementById(inputId).value.trim() !== ''){
    return true;
  } else {
    return false;
  }
}

// Function called when user submits information. Checks only inputted value airports if no other inputs.
function checkInputs(){

  let isValidDate1 = true;
  let isValidDate2 = true;

  // Check if input start date and end date is empty, if not then check if they are in the correct format.
  // If at least one of them is not empty it will check both.
  if (checkInputIsNotEmpty('effectiveStartDate') || checkInputIsNotEmpty('effectiveEndDate')){
    isValidDate1 = checkInputDate('effectiveStartDate', 'error-message1');
    isValidDate2 = checkInputDate('effectiveEndDate', 'error-message2');
  } else {
    document.getElementById('error-message1').textContent = '';
    document.getElementById('error-message2').textContent = '';
  }

  const isValidStart = checkInputAirport('startAirport', 'error-message3');
  const isValidDest = checkInputAirport('destAirport', 'error-message4');

  let isValidDests = true;
  let isValidDestI = false;
  for (let i = 3; i <= destinationCounter; i++){
      isValidDestI = checkInputAirport('destinationLocation' + (i-1), 'error-message' + (i+2));
      if (!isValidDestI){
          isValidDests = false;
      }
  }
  
  let isValidRadius = true;
  let isValidPathWidth = true;

  // Check circle radius and path width
  if (checkInputIsNotEmpty('radius') || checkInputIsNotEmpty('pathWidth')){
    isValidRadius = checkInputRadius('radius', 'error-messageR');
    isValidPathWidth = checkInputPathWidth('pathWidth', 'error-messageW');
  } else {
    document.getElementById('error-messageR').textContent = '';
    document.getElementById('error-messageW').textContent = '';
  }

  if (isValidDate1 && isValidDate2 && isValidStart && isValidDest && isValidDests && isValidRadius && isValidPathWidth){
     submitForm();
  }
  
}

// Function to return to the form page.
function returnToForm() {
  window.location.href = "/";
}
