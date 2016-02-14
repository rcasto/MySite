(function () {
    
    // check if key is set in local storage, trigger animations only on unique page load
    // Since this is a binary trigger it does not really matter what is stored as long as something is
    if (!window.sessionStorage.getItem('hasAnimated')) {
        window.sessionStorage.setItem('hasAnimated', true);
        document.getElementsByClassName('header')[0].className += " slidetop";
    }
    
}());