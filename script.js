

//Declare an array to store everything in.  Initialize as empty strings
let calendarHours = {
  "8 AM": "", "9 AM": "", "10 AM": "", "11 AM": "",  "12 PM": "", "1 PM": "",
  "2 PM": "",  "3 PM": "",  "4 PM": "", "5 PM": "",  "6 PM": ""
};

$(document).ready(function(){
  // Check local storage, add hours if empty, otherwise parse local storage
  if(!localStorage.getItem('calendarHours')) {
    updateTasks(calendarHours);
  } else {
    updateTasks(JSON.parse(localStorage.getItem('calendarHours')));
  }
})

// Get the date formatted to put in header bar. The Euro D/M/YY format is for Corrado
date = moment().format('dddd') + " | " + moment().format('D MMMM YYYY | h:mm a');
$('#date-today h6').text(date);
msg = "(Don't forget to save by clicking the floppy disk icon!)"
$('#instructions h6').text(msg);

let counter = 1;  //HTML text-entry tag numbering starts at 1
for(let i in calendarHours) {
  // select an HTML tag to work on
  let textEntry = "#text-entry" + counter;
  $(textEntry).text(calendarHours[i]);
  //loop over each of the div id's time1, time2, etc. to get html time tags
  let timeTag = "#time" + counter;
  //get serial number of the current hour (e.g., "5 PM" = 17)
  // HARD CODE THE BELOW NUMBER TO 12 TO SEE THAT THE COLORS WORK
  let currentHour = new Date().getHours();  //<-- hardcode this to 12
  // get the current time label for this loop ("8 AM" for i=1)
  let timeString = $(timeTag).text();
  // set timeNumber according to function that converts to 24hr
  let timeNumber = getHourHandle(timeString);
  // Loop over horizontal time bars to color according to past/present/future
  if(timeNumber < currentHour) {
    $(textEntry).addClass("past-hour");
  } else if (timeNumber > currentHour) {
    $(textEntry).addClass("future-hour");
  } else {
    $(textEntry).addClass("current-hour");
  }
  counter ++;
}  //end for-loop

// Define save on click behavior
$("button").click(function() {
  value = $(this).siblings("textarea").val();
  hourString = $(this).siblings("div").text();
  //Add element to calendar
  saveCalendar(hourString, value);
});

  // convert "8 AM" to 8, but also "3 PM" to 15...
  function getHourHandle(hourString) {
    tmp = parseInt(hourString.split(" ")[0]);
    //this is cheating a bit, but it works for an 8 to 6pm calendar!
    tmp = ((tmp < 8) ? tmp + 12 : tmp)
    return tmp;
  }


  // Convert emtpy calendarHours list above to JSON
  function initStorage() {
    localStorage.setItem('calendarHours', JSON.stringify(calendarHours));
  }

//Fetch the initial values and any stored values in Calendar
function getStoredInfo() {
  result = localStorage.getItem('calendarHours');
  debugger;
  return (result ? result : calendarHours);
}

// Create/update a task
function updateTasks(taskObject) {
  $(".calendar-row").each(function(index) {
    let res = $(this).children("div");
    $(this).children("textarea").text(taskObject[res.text()]);
  });
}

// Stringify and save new entry to local storage
function saveToStorage(newTask) {
  localStorage.setItem('calendarHours', JSON.stringify(newTask));
}

//  Check if calendarHours has populated, if not rerun initialize
function saveCalendar(hourString, val) {
  if(!localStorage.getItem('calendarHours')) {
    initStorage();
  }
  let calByHour = JSON.parse(localStorage.getItem('calendarHours'));
  calByHour[hourString] = val;
  saveToStorage(calByHour);
}
