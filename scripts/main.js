var skills = {};
var character = {"level":0, "engrams": 0, "spent":0};

$(document).ready(function() {
	fillLevels();
	totalEngrams();

	$.getJSON('json/skills.json', function(data) { //Http://www.enjoythegame.net/arkplanner/json/skills.json for ETG site
		skills = data;
		buildSkillsTable();
		updateEngramDisplay();
	});

	$('#levelSelect').on('change', function() {
		totalEngrams();

		updateAllSkillViews();

		updateEngramDisplay();
	});

	$('#viewSelect').on('change', function() {
		updateAllSkillViews();
	});
	
	var charstring = getParameterByName("char");

	if (charstring != "") {
		loadSavedCharacter(charstring);
	}
});

function buildSkillsTable() {  //builds main table of skill divs
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
		
		
		if (hasOwnProperty.call(this, "requires")) { //better effect. may not work good with saved characters
			$(skillItem).hide();
		}

		if (val.level > character.level) { //better effect. may not work good with saved characters
			$(skillItem).hide();
		}
		//updateSkillView($(skillItem)); // this causes an ugly effect.  After drawing everything to screen it goes back and hides things.
		//updateAllSkillViews(); // this causes an ugly effect.  After drawing everything to screen it goes back and hides things.
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
		
		checkSkillDependencies($.data(this, "requiredBy"));
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

	return true;
}

function totalEngrams() {
	var oldValue = character.engrams;

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

	$('#totalEngrams').prop('number', oldValue).animateNumber({number: character.engrams},200);

	return true;
}

function checkSkillDependencies(skills) {  // Takes in an array of hidden skills.  checks each skill to see if they should be unhidden.
	for (var i =0; i < skills.length; i++) {
		var itemToBeChecked = $("#" + skills[i]);
		updateSkillView(itemToBeChecked);
	}
}

function checkRequirements(skill) {  //takes in a skill jquery object.  returns "", else returns requirement not met.
	var requirmentsMet = "";

	if (skill.data("engrams") > (character.engrams - character.spent)) {
		requirmentsMet = "engrams";
	}

	if (hasOwnProperty.call(skill.data(), "requires")) {
		for (var i = 0; i < skill.data("requires").length; i++) {
			if ( !($("#" + skill.data("requires")[i]).data( "selected" )))  {
				requirmentsMet = "requires";
			}
		}
	}

	if (skill.data("level") > character.level) {
		requirmentsMet = "level";
	}


	return requirmentsMet;
}


function selectSkill(skill) {  //takes in a jquery object skill div. checks requirements to select. then runs select logic
	var requirementsMissing = checkRequirements(skill);

	if (requirementsMissing === "") {
		character.spent += skill.data("engrams");
		updateEngramDisplay();
		skill.data("selected", true);
		skill.addClass("selected");
		skill.animate({opacity: '1'}, 300);
		return true;
	}
	else{
		switch (requirementsMissing) {
			case "level":
				showError(skill);
				showError($("#currentLevelDiv"));
				break;
			case "requires":
				showError(skill);

				/////////////////////add code here for showing unmet required skills
				break;
			case "engrams":
				showError(skill);
				showError($("#remainingEngramsDiv"));
				break;
			default:
				showError(skill);				
		}
		return false;
	}
}

function deselectSkill(skill) { //takes in a jquery object skill div. runs de-select logic
	if (skill.data("selected") == true) {
		character.spent -= skill.data("engrams");
		updateEngramDisplay();
	}
	skill.data("selected", false);
	skill.removeClass( "selected" );
	skill.animate({opacity: '0.5'}, 300);
	return true;
}

function updateEngramDisplay() {
	var oldSpentValue = parseInt($("#spentEngrams").text());
	var oldRemainingValue = parseInt($("#remainingEngrams").text());
	var newRemainingValue = (character.engrams - character.spent);

	$('#spentEngrams').prop('number', oldSpentValue).animateNumber({number: character.spent},200);
	$('#remainingEngrams').prop('number', oldRemainingValue).animateNumber({number: newRemainingValue},200);
	
}

function loadSavedCharacter(characterString) { ////eventually will select skills, level, etc based on GET parameter base64 string.
	var decodedCharacter = atob(characterString);
	alert(decodedCharacter);
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function updateAllSkillViews() { //// updates view for all skills
	$("#body>div").each(function() {
		updateSkillView($(this));
	});
}

function updateSkillView(skill) { ///updates view for one skill
	var missingRequirements = checkRequirements(skill);
	if (missingRequirements == "") {
		skill.show(200);
		return true;
	}
	switch (missingRequirements) {
		case "level":
			deselectSkill(skill);
			if ($("#viewSelect option:selected").val() == "0") {
				skill.hide(200);
			}
			else {
				skill.show(200);
			}
			break;
		case "requires":
			deselectSkill(skill);
			if ($("#viewSelect option:selected").val() == "0") {
				skill.hide(200);
			}
			else {
				skill.show(200);
			}
			break;
		default:
			skill.show(200);
	}
	return false;
}

function showError(errorDiv) { ///takes in a jquery object.  animates that object with the 'error' animation.  currently flash some red
	errorDiv.toggleClass("transition");
	errorDiv.toggleClass("error");

	setTimeout(function (){
		errorDiv.toggleClass("error");
		errorDiv.toggleClass("transition");
	}, 750);
}


