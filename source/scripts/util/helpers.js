var Helpers = (function () {
    
    // This function will print out a date string in the following form
    // ex) January 15, 2017
    // If no date object is passed in the current date will be used
    function simpleDateString(date) {
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        date = date || new Date();
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return `${monthNames[monthIndex]} ${day} ${year}`;
    }
    
    return {
        simpleDateString: simpleDateString  
    };
    
}());