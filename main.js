var skills = {};

$(document).ready(function() {
	$.getJSON('skills.json', function(data) {
        	skills = data;
		buildSkillsTable();
    	});	
});

function buildSkillsTable() {
	$.each(skills.skills, function(key, val) {
		var skillItem = document.createElement("div");   				
		$(skillItem).data(val);
		skillItem.innerHTML = $(skillItem).data("skillName"); 
		$(skillItem).addClass("skillitem");
		$('#body').append(skillItem);
	});


	$(".skillitem").hover(function() {
		$(this).animate({opacity: '1'});
	}, function() { 
		$(this).animate({opacity: '0.5'});
	});
};
