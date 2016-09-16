(function () {
    // Get document of template html file, the underscore (_) is used for the web components polyfill
    var importDoc = document._currentScript.ownerDocument;

    // Create a prototype for a new element that extends HTMLElement
    var PageControlsProto = Object.create(HTMLElement.prototype);

    // This callback is invoked synchronously with element instantiation
    PageControlsProto.createdCallback = function () {
        // Grab our template
        var template = importDoc.querySelector('.page-controls-template');

        // Setup our Shadow DOM and clone the template
        var root = (this.attachShadow && this.attachShadow({ mode: 'open' })) ||
                   (this.createShadowRoot && this.createShadowRoot());
        var clone = document.importNode(template.content, true);

        // Add template content to shadow root
        root.appendChild(clone);

        this.currentPageElem = root.querySelector('.current-page');
        this.totalPagesElem = root.querySelector('.total-pages');
        this.prevPageButton = root.querySelector('.page-back');
        this.nextPageButton = root.querySelector('.page-forward');

        // attach page navigation actions
        this.prevPageButton.onclick = () => {
            this.currentPage && this.dispatchEvent(new CustomEvent('navigate-page', {
                detail: this.currentPage - 1
            }));
        };
        this.nextPageButton.onclick = () => {
            this.currentPage && this.dispatchEvent(new CustomEvent('navigate-page', {
                detail: this.currentPage + 1
            }));
        };

        // Watch for changes to attribute values
        var mutationObserver = new MutationObserver((records) => {
            var attribute, attributeValue;
            var currentPage, totalPages;
            records.forEach((record) => {
                attribute = record.attributeName;
                attributeValue = this.getAttribute(attribute);
                if (attribute === 'data-page') {
                    currentPage = parseInt(attributeValue, 10);
                } else if (attribute === 'data-total-pages') {
                    totalPages = parseInt(attributeValue, 10);
                }
            });
            this.setState(currentPage, totalPages);
        });
        mutationObserver.observe(this, {
            attributes: true
        });

        // Initialize state from passed in parameters, if any
        var currentPage = parseInt(this.getAttribute('data-page'), 10);
        var totalPages = parseInt(this.getAttribute('data-total-pages'), 10);
        
        this.setState(currentPage, totalPages);
    };

    PageControlsProto.setState = function (currentPage, totalPages) {
        if (currentPage) {
            this.currentPage = currentPage;
            this.currentPageElem.innerHTML = currentPage;
        }
        if (totalPages) {
            this.totalPages = totalPages;
            this.totalPagesElem.innerHTML = totalPages;
        }
        this.prevPageButton.style.display = this.currentPage - 1 <= 0 ? 'none' : 'inline-block';
        this.nextPageButton.style.display = this.currentPage + 1 > this.totalPages ? 'none' : 'inline-block'; 
    };

    // Register our new element
    document.registerElement('page-controls', {
        prototype: PageControlsProto
    });
}());