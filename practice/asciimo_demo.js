var util = require('util');
var asciimo = require('asciimo').Figlet;
var colors = require('colors'); // add colors for fun

// pick the font file
var font = 'Doom';
// set text we are writeing to turn into leet ascii art
var text = "17qingsong";

asciimo.write(text, font, function(art){
  util.puts(art.green);
});