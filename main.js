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
		$(skillItem).css("background","url(img/engram/Spear_Icon.png)");
		$(skillItem).css("background","url(" + $(skillItem).data("image") + ")");
		$(skillItem).css("background-size", "contain");
		$('#body').append(skillItem);
	});

	$(".skillitem").hover(function() {
		$(this).animate({opacity: '1'});
	}, function() {
		$(this).animate({opacity: '0.5'});
	});

	$(window).resize(function() {
		resizeSkillWidth();
	});

	resizeSkillWidth();
}

function resizeSkillWidth() {
	$(".skillitem").css({'height':$('.skillitem').width() + 'px'});
}