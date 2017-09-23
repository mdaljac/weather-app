$(document).ready(function() {
	$('a[data-toggle="collapse"]').click(function(e){
		if ($(window).width() >= 992) {
			e.stopPropagation();
		} 
	});
});