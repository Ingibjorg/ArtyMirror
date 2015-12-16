$(document).ready(function () {
    // Create two variable with the names of the months and days in an array
    var monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    var dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

    // Create a newDate() object
    var newDate = new Date();
    // Extract the current date from Date object
    newDate.setDate(newDate.getDate());

    // Output the day and date
    $('#day').html(dayNames[newDate.getDay()]);
    $('#date').html(newDate.getDate() + "/" + monthNames[newDate.getMonth()]);

    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    // Add a leading zero to the value and output hours and minutes
    $("#clock").html(( hours < 10 ? "0" : "" ) + hours + ":" + ( minutes < 10 ? "0" : "" ) + minutes);

    setInterval(function () {
        // Create a newDate() object and extract the hours of the current time on the visitor's
        var hours = new Date().getHours();
        var minutes = new Date().getMinutes();
        // Add a leading zero to the value and output hours and minutes
        $("#clock").html(( hours < 10 ? "0" : "" ) + hours + ":" + ( minutes < 10 ? "0" : "" ) + minutes);
    }, 1000);
});
