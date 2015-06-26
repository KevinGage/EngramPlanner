var skills = {};

$(document).ready(function() {
	$.getJSON('skills.json', function(data) {
        	skills = data;
		buildSkillsTable();
    	});
});

function buildSkillsTable() {
	$.each(skills.skills, function(key, val) {
		//$('#body').append(key.toString());
		$('#body').append(val.skillName);
	});
	$('#body').append("wrote some things");
};
