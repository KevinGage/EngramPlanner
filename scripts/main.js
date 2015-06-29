var skills = {};
var character = {"level":0, "engrams": 0, "spent":0};

$(document).ready(function() {
	$.getJSON('json/skills.json', function(data) {
        skills = data;
	buildSkillsTable();
    });	
	
	fillLevels();
	totalEngrams();
	
	$('#levelSelect').on('change', function() {
		totalEngrams();
	});
});

function buildSkillsTable() {
	$.each(skills.skills, function(key, val) {
		var skillItem = document.createElement("div");
		$(skillItem).data(val);
		$(skillItem).attr("id", $(skillItem).data("skillName").split(" ").join(""));
		$(skillItem).addClass("skillitem");
		$(skillItem).css("background","url(img/engram/Spear_Icon.png)");
		$(skillItem).css("background","url(" + $(skillItem).data("image") + ")");
		$(skillItem).css("background-size", "contain");
		$('#body').append(skillItem);
		var skillItemText = document.createElement("span");
		skillItemText.innerHTML = $(skillItem).data("skillName");
		$(skillItem).append(skillItemText);
		
		if (hasOwnProperty.call(this, "requires")) {
			$(skillItem).hide();
		}
	});

	$(".skillitem").hover(function() {
		if (!($(this).data("selected"))) {
			$(this).animate({opacity: '1'}, 300);
		}
	}, function() {
		if (!($(this).data("selected"))) {
			$(this).animate({opacity: '0.5'}, 300);
		}
	});
	
	$(".skillitem").click(function() {
		if (($(this).data("selected"))) {
			deselectSkill($(this));
		}
		else {
			selectSkill($(this));
		}
		
		if (hasOwnProperty.call($(this).data(), "requiredBy")) {
			checkHidden($.data(this, "requiredBy"));
		}
	})

	$(window).resize(function() {
		resizeSkillWidth();
	});

	resizeSkillWidth();
}

function resizeSkillWidth() {
	$(".skillitem").css({'height':$('.skillitem').width() + 'px'});
}

function fillLevels() {
	for (var i = 1; i <= 65; i++) {
		$('#levelSelect')
			.append($('<option>', { i : i })
			.text(i)); 
	}

	$('#levelSelect option:last-child').attr('selected', 'selected');
}

function totalEngrams() {
	var x = parseInt($("#levelSelect option:selected").val());
	character.level = x;
	switch(true) {
    case (x === 1):
		character.engrams = 0;
        break;
    case (x >= 2 && x < 10):
        character.engrams = ((x-1) * 8);
        break;
	case (x >= 10 && x < 20):
        character.engrams = (64 + ((x - 9) * 12));
        break;
	case (x >= 20 && x < 30):
        character.engrams = (184 + ((x - 19) * 16));
        break;
	case (x >= 30 && x < 40):
        character.engrams = (344 + ((x - 29) * 20));
        break;
	case (x >= 40 && x < 50):
        character.engrams = (544 + ((x - 39) * 24));
        break;
	case (x >= 50 && x < 60):
        character.engrams = (784 + ((x - 49) * 28));
        break;
	case (x >= 60 && x < 65):
        character.engrams = (1064 + ((x - 59) * 40));
        break;
	case (x === 65):
		character.engrams = (1265);       
	default:
		$("#totalEngrams").text("you a haxor");
		break;
	}
	$("#totalEngrams").text(character.engrams);
}

function checkHidden(skill) {
	for (var i =0; i < skill.length; i++) {
		checkMyRequirements(skill[i]);
	}
}

function checkMyRequirements(skill) {
	var show = true;
	var checkMyRequirements = $("#" + skill);

	for (var i = 0; i < checkMyRequirements.data("requires").length; i++) {
		if ( !($("#" + checkMyRequirements.data("requires")[i]).data( "selected" )))  {
			show = false;
		}
	}
	
	if (show){
		checkMyRequirements.show(400);
	}
	else{
		checkMyRequirements.hide(400);
	}
	return true;
}

function selectSkill(skill) {
	if ((character.engrams - character.spent - skill.data("engrams")) >= 0) {
		character.spent += skill.data("engrams");
		$("#spentEngrams").text(character.spent);
		$("#remainingEngrams").text(character.engrams - character.spent);
		
		skill.data("selected", true);
		skill.addClass("selected");
		skill.animate({opacity: '1'}, 300);
		return true;
	}
	else{
		skill.toggleClass("transition");
		$("#remainingEngramsDiv").toggleClass("transition");
		
		skill.toggleClass("error");
		$("#remainingEngramsDiv").toggleClass("error");
		
		setTimeout(function (){
			skill.toggleClass("error");
			$("#remainingEngramsDiv").toggleClass("error");
			skill.toggleClass("transition");
			$("#remainingEngramsDiv").toggleClass("transition");			
		}, 750);

		
	

		return false;
	}
}

function deselectSkill(skill) {
	character.spent -= skill.data("engrams");
	$("#spentEngrams").text(character.spent);
	$("#remainingEngrams").text(character.engrams - character.spent);
	skill.data("selected", false);
	skill.removeClass( "selected" );
	skill.animate({opacity: '0.5'}, 300);
	return true;
}
