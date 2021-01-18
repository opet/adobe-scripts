// Calculate relative luminance and check 
// contrast against WCAG 2.0 guidelines.
//
// Tested on Adobe Illustrator 2021.
//
// By Øyvind Pettersen
// https://github.com/opet/adobe-scripts

var colors = [];
var luminances = [];
var contrast;
var wcag = [];

if (app.documents.length && app.selection.length == 2)  
{  
    for (var a=0; a<app.selection.length; a++)  
        {   
            if (app.selection[a].typename == "TextFrame") {
                color = app.selection[a].textRange.paragraphs[0].fillColor; 
            } else {
                color = app.selection[a].fillColor; 
            }
            colors[a] = color;
            luminances[a] =  lumi(color.red, color.green, color.blue);

        }
    if (luminances[0] > luminances[1]) {
        contrast = (luminances[0] + 0.05) / (parseFloat(luminances[1]) + 0.05);
    } else {
        contrast = (luminances[1] + 0.05) / (parseFloat(luminances[0]) + 0.05);
    }

    // Add WCAG -- normalAA, normalAAA, largeAA, largeAAA
    if (contrast > 7.0) {
        wcag = ["pass", "pass", "pass", "pass"];
    } else if (contrast > 4.5) {
        wcag = ["pass", "fail", "pass", "pass"];
    } else if (contrast > 3.0) {
        wcag = ["fail", "fail", "pass", "fail"];
    } else {
        wcag = ["fail", "fail", "fail", "fail"];
    }

    // DIALOG
    // ======
    var dialog = new Window("dialog"); 
        dialog.text = "Relative luminance and contrast ratio"; 
        dialog.orientation = "column"; 
        dialog.alignChildren = ["center","top"]; 
        dialog.spacing = 20; 
        dialog.margins = 16; 

    // GROUP0
    // ======
    var group0 = dialog.add("group", undefined, {name: "group0"}); 
        group0.orientation = "row"; 
        group0.alignChildren = ["left","center"]; 
        group0.spacing = 10; 
        group0.margins = 0; 

    // PANEL1
    // ======
    var panel1 = group0.add("panel", undefined, undefined, {name: "panel1"}); 
        panel1.text = "L : " + (luminances[0]*100).toFixed(2) + "%"; 
        panel1.orientation = "column"; 
        panel1.alignChildren = ["left","top"]; 
        panel1.spacing = 10; 
        panel1.margins = 10; 

    // GROUP1
    // ======
    var group1 = panel1.add("group", undefined, {name: "group1"}); 
        group1.orientation = "column"; 
        group1.alignChildren = ["left","center"]; 
        group1.spacing = 10; 
        group1.margins = 30; 
        group1.graphics.backgroundColor = group1.graphics.newBrush (group1.graphics.BrushType.SOLID_COLOR, [colors[0].red/255, colors[0].green/255, colors[0].blue/255]);

    var statictext1 = group1.add("group"); 
        statictext1.orientation = "column"; 
        statictext1.alignChildren = ["left","center"]; 
        statictext1.spacing = 0; 

        statictext1.add("statictext", undefined, "The quick brown fox", {name: "statictext1"}); 
        statictext1.add("statictext", undefined, contrast.toFixed(2) + " : 1", {name: "statictext1"}); 
        statictext1.graphics.font = ScriptUI.newFont("Letter Gothic Std", "Bold", 18);
        statictext1.graphics.foregroundColor = statictext1.graphics.newPen(statictext1.graphics.PenType.SOLID_COLOR, [colors[1].red/255, colors[1].green/255, colors[1].blue/255], 1);

    // PANEL2
    // ======
    var panel2 = group0.add("panel", undefined, undefined, {name: "panel2"}); 
        panel2.text = "L : " + (luminances[1]*100).toFixed(2) + "%"; 
        panel2.orientation = "column"; 
        panel2.alignChildren = ["left","top"]; 
        panel2.spacing = 10; 
        panel2.margins = 10; 

    // GROUP2
    // ======
    var group2 = panel2.add("group", undefined, {name: "group2"}); 
        group2.orientation = "column"; 
        group2.alignChildren = ["left","center"]; 
        group2.spacing = 10; 
        group2.margins = 30;
        group2.graphics.backgroundColor = group2.graphics.newBrush(group2.graphics.BrushType.SOLID_COLOR, [colors[1].red/255, colors[1].green/255, colors[1].blue/255]);

    var statictext2 = group2.add("group"); 
        statictext2.orientation = "column"; 
        statictext2.alignChildren = ["left","center"]; 
        statictext2.spacing = 0; 

        statictext2.add("statictext", undefined, "The quick brown fox", {name: "statictext2"}); 
        statictext2.add("statictext", undefined, contrast.toFixed(2) + " : 1", {name: "statictext2"});    
        statictext2.graphics.font = ScriptUI.newFont("Verdana", "Bold", 18);
        statictext2.graphics.foregroundColor = statictext2.graphics.newPen(statictext2.graphics.PenType.SOLID_COLOR, [colors[0].red/255, colors[0].green/255, colors[0].blue/255], 1);

    // GROUP4
    // ======
    var group4 = dialog.add("group", undefined, {name: "group4"}); 
        group4.orientation = "column"; 
        group4.alignChildren = ["left","center"]; 
        group4.spacing = 10; 
        group4.margins = 0; 

    // PANEL3
    // ======
    var panel3 = group4.add("panel", undefined, undefined, {name: "panel3"}); 
        panel3.text = "WCAG 2.0"; 
        panel3.orientation = "column"; 
        panel3.alignChildren = ["left","top"]; 
        panel3.spacing = 10; 
        panel3.margins = 10; 

    var statictext3 = panel3.add("statictext", undefined, undefined, {name: "statictext3"}); 
        statictext3.text = "Normal: AA " + wcag[0] + " - AAA " + wcag[1]; 

    var statictext4 = panel3.add("statictext", undefined, undefined, {name: "statictext4"}); 
        statictext4.text = "Large: AA " + wcag[2] + " - AAA " + wcag[3]; 


    dialog.show();
}

// Calculate relative luminance
// from https://gist.github.com/jfsiii/5641126

function lumi(R8bit, G8bit, B8bit) {
    var RsRGB = R8bit/255;
    var GsRGB = G8bit/255;
    var BsRGB = B8bit/255;

    var R = (RsRGB <= 0.03928) ? RsRGB/12.92 : Math.pow((RsRGB+0.055)/1.055, 2.4);
    var G = (GsRGB <= 0.03928) ? GsRGB/12.92 : Math.pow((GsRGB+0.055)/1.055, 2.4);
    var B = (BsRGB <= 0.03928) ? BsRGB/12.92 : Math.pow((BsRGB+0.055)/1.055, 2.4);

    // For the sRGB colorspace, the relative luminance of a color is defined as: 
    var L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

    return L;
}