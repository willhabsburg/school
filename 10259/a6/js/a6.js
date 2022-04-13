/* William Habsburg
   000869622
   Assignment 6 JavaScript file
   This is a AJAX communication program
*/

//jQuery adding elements to parents from https://www.techiedelight.com/how-to-insert-html-into-a-div-with-javascript-jquery/
//jQuery deleting child elements from https://stackoverflow.com/questions/11713306/how-can-i-remove-children-in-jquery

/* onLoad event listener
   Creates event handlers for player name and for gameplay
*/
var SWorM;
window.addEventListener("load", function () {

    let button1 = document.getElementById("button1");
    let button2 = document.getElementById("button2");
    let button3 = document.getElementById("button3");

    /**
     *  Event Listener for button1 (No parameters)
     **/
     button1.addEventListener("click", function () {
        fetch("https://csunix.mohawkcollege.ca/~adams/10259/a6_responder.php", { credentials: 'include' })
            .then(response => response.text())
            .then(button1success);
    });

    /**
     *  Event Listener for button3 (GET)
     **/
     button2.addEventListener("click", function () {
        let url = "https://csunix.mohawkcollege.ca/~adams/10259/a6_responder.php?choice=";
        if (verifyInput()) {
            url += SWorM.replace(" ", "");
            fetch(url, { credentials: 'include' })
                .then(response => response.json())
                .then(button2success);
        }
    });

    /**
     *  Event Listener for button3 (POST)
     **/
    button3.addEventListener("click", function () {
        let url = "https://csunix.mohawkcollege.ca/~adams/10259/a6_responder.php";
        if (verifyInput()) {
            fetch(url, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: "choice=" + SWorM.replace(" ", "")
            })
                .then(response => response.json())
                .then(button3success);
        }
    });

});

/**
*  Success function for button1 (No parameters)
*  Adds text response plus my student number to #button1result
*
*  @param text - the text response from the server
**/
function button1success(text) {
    let button1element = $("#button1result");
    button1element.children().remove();
    let button1h1 = $("<h1>");
    button1h1.attr("class", "text-primary");
    button1h1.css({
        display: "block",
        width: "100%"
    }).text(text + " - Student # 000869622");
    button1element.append(button1h1);
}

/**
*  Success function for button2 (GET)
*  Fomats JSON response into #picutres div formatted as required.
*  Removes all child elements before adding new ones
*
*  @param textArr - a two-dimentional string array representing 1-3 divs
**/
function button2success(txtArr) {
    console.log(txtArr);
    let count = txtArr.length;
    let picturesDiv = $("#pictures");
    picturesDiv.children().remove();
    for (let i = 0; i < count; i++) {
        let newDiv = $("<div>");
        newDiv.addClass("col-" + (12 / count));
        newDiv.html("<h2>" + txtArr[i]["series"] + "</h2><img src=\"" + txtArr[i]["url"] + "\"></img><h5>" + txtArr[i]["name"] + "</h5>");
        picturesDiv.append(newDiv);
    }
    $("h2").addClass("centered");
    $("img").addClass("centered");
    $("h5").addClass("centered");
    $("img").attr("alt", "A picture related to " + SWorM);
    let copyright = $("<h6>");
    copyright.attr("id", "copyright");
    copyright.text(getCopyrightText);
    picturesDiv.append(copyright);
}

/**
*  Success function for button3 (POST)
*  Fomats JSON response into #table div formatted as required.
*  Removes all child elements before adding new ones
*
*  @param textArr - a two-dimentional string array representing a table
**/
function button3success(txtArr) {
    console.log(txtArr);
    let tableDiv = $("#table");
    tableDiv.children().remove();
    let table = $("<table>");
    table.attr("class", "table table-primary table-striped");
    let thead = $("<thead>");
    thead.html("<th>Series</th><th>Name</th><th>Link</th>");
    table.append(thead);
    let tbody = $("<tbody>");
    for (let i = 0; i < txtArr.length; i++) {
        let tr = $("<tr>");
        tr.html("<td>" + txtArr[i]["series"] + "</td><td>" + txtArr[i]["name"] + "</td><td><a href=\"" +
            txtArr[i]["url"] + "\">" + txtArr[i]["url"] + "</a></td>");
        tbody.append(tr);
    }
    table.append(tbody);
    tableDiv.append(table);
    let copyright = $("<h6>");
    copyright.attr("id", "copyright");
    copyright.text(getCopyrightText);
    tableDiv.append(copyright);
}


/** Function getCopyrightText()
*  Returns the appropriate copyright text based on user selection
*
*  @returns string of copyright text
**/
function getCopyrightText() {
    if (SWorM == "mario")
        return "Game trademarks and copyrights are properties of their respective owners. \
        Nintendo properties are trademarks of Nintendo. © 2019 Nintendo.";
    else
        return "Star Wars © & TM 2022 Lucasfilm Ltd. All rights reserved. Visual material © 2022 Electronic Arts Inc.";
}

/** Function verifyInput()
*  Verifies user input of the textbox
*  Gives error message if valid, removes error message if valid
*
*  @returns boolean true or false based on if user entry is "star wars" or "mario"
**/
function verifyInput() {
    SWorM = $("#name").val().toLowerCase();
    if (SWorM == "star wars" || SWorM == "mario") {
        $("#name").attr("disabled", "disabled");
        $("#errorMessage").css("display", "none");
        return true;
    }
    $("#errorMessage").html("<h3 class=\"bg-primary text-white mt-3\">Please enter 'star wars' or 'mario' (without the quotes)</h3>");
    $("#errorMessage").css("display", "block");
    return false;
}
