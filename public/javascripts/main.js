(function () {

	var content = "Suspendisse vel volutpat elit. Sed ultrices posuere elit, quis placerat enim. Vivamus at sem sapien. Morbi magna est, porttitor non tellus eu, dignissim dictum urna. Suspendisse nec placerat sem. Aliquam dapibus, erat at sodales dignissim, lectus mauris fringilla felis, eget ullamcorper nisl quam eget felis. Nam quis vulputate ex. Aliquam sit amet quam ut lectus accumsan vestibulum non id nibh. Praesent eget laoreet tellus, quis gravida enim. Sed porttitor condimentum elit, ut ultrices augue suscipit a. Donec scelerisque nisl ut aliquam pulvinar. Ut accumsan mi efficitur turpis congue fringilla.";

	var contentElem;

	window.onload = function () {
		var addContent = document.getElementById('add-content');

		contentElem = document.getElementsByClassName('content')[0];

		addContent.onclick = function () {
			var div = document.createElement('div');
			div.appendChild(document.createTextNode(content));
			contentElem.appendChild(div);
		};
	};

}())