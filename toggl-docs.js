/*
    Imports time from www.toggl.com to a spreadsheet in Google Drive
    Copyright (C) 2013  koen-github

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

    Source located here: https://github.com/koen-github/Toggl-script-for-Google-Docs

*/
function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [ {name: "Get Times", functionName: "action"}                  ];
  ss.addMenu("Toggl Times", menuEntries);
}

var mydoc = SpreadsheetApp.getActiveSpreadsheet();
var sheet = mydoc.getSheets()[0];
var myCell = mydoc.getActiveCell();
var myRow = myCell.getRow();
var myCol = myCell.getColumn();

function action() {

    ScriptProperties.setProperties({
        'col': myCol,
        'row': myRow
    }, true);


    var app = UiApp.createApplication().setTitle('Timing from Last week - Select Time').setHeight(400).setWidth(500);

    var form = app.createFormPanel().setId('form').setEncoding('multipart/form-data');
    var formContent = app.createGrid().resize(15, 3);
    form.add(formContent);

    var unamepass = "INSERT_API_KEY:api_token"; //insert your api key here
    var digest = Utilities.base64Encode(unamepass);
    var digestfull = "Basic " + digest;

    var response = UrlFetchApp.fetch("https://www.toggl.com/api/v6/time_entries.json", {

        method: "get",
        headers: {
            "Authorization": digestfull
        }
    });
    var test = response.getContentText();
    var blaat = Utilities.jsonParse(test).data;


    for (var i = 1; i <= blaat.length; i++) {
        formContent.setWidget(i, 0, app.createLabel(blaat[i - 1]["description"]));
        formContent.setWidget(i, 1, app.createRadioButton("radio1", cheat(blaat[i - 1]["duration"])).setFormValue(cheat(blaat[i - 1]["duration"])));
    }
    formContent.setWidget(13, 0, app.createSubmitButton('Insert Time!'));


    app.add(form);
    mydoc.show(app);


}

function doPost(e) {
    var row1 = ScriptProperties.getProperty('row');

    var col1 = ScriptProperties.getProperty('col');

    var app = UiApp.getActiveApplication();

    var radio = e.parameter.radio1;

    sheet.getRange(row1, col1, 1, 1).setValue(radio);
  return app.close()

}

function cheat(secs) {
    var t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    return t.toTimeString().substr(0, 8);
}
