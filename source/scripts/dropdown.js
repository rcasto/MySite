var Dropdown = (function () {
    
    return function (dropDownData, target) {
        var container = document.createElement('div'), itemContainer, parent;
        container.className = "dropdown";
        dropDownData && dropDownData.forEach(function (dropDownItem) {
            itemContainer = (itemContainer && itemContainer.cloneNode()) || 
                             document.createElement('div');
            itemContainer.innerHTML = dropDownItem;
            container.appendChild(itemContainer);
        });
        parent = document.querySelector(target) || document.body;
        parent.appendChild(container);
    };
    
}());