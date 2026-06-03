#!/usr/bin/env node
const fs = require("fs");

const ROWS = [
  ["A1","A24","B20","C10","D3","D25","E21","F19","G16","H17"],
  ["A2","A25","B21","C11","D4","D26","E22","F20","G17","H18"],
  ["A3","A26","B22","C12","D5","E1","E23","F21","G18","H19"],
  ["A4","B1","B23","C13","D6","E2","E24","F22","G19","H20"],
  ["A5","B2","B24","C14","D7","E3","F1","F23","G20","H21"],
  ["A6","B3","B25","C15","D8","E4","F2","F24","G21","H22"],
  ["A7","B4","B26","C16","D9","E5","F3","F25","H1","H23"],
  ["A8","B5","B27","C17","D10","E6","F4","G1","H2","M1"],
  ["A9","B6","B28","C18","D11","E7","F5","G2","H3","M2"],
  ["A10","B7","B29","C19","D12","E8","F6","G3","H4","M3"],
  ["A11","B8","B30","C20","D13","E9","F7","G4","H5","M4"],
  ["A12","B9","B31","C21","D14","E10","F8","G5","H6","M5"],
  ["A13","B10","B32","C22","D15","E11","F9","G6","H7","M6"],
  ["A14","B11","C1","C23","D16","E12","F10","G7","H8","M7"],
  ["A15","B12","C2","C24","D17","E13","F11","G8","H9","M8"],
  ["A16","B13","C3","C25","D18","E14","F12","G9","H10","M9"],
  ["A17","B14","C4","C26","D19","E15","F13","G10","H11","M10"],
  ["A18","B15","C5","C27","D20","E16","F14","G11","H12","M11"],
  ["A19","B16","C6","C28","D21","E17","F15","G12","H13","M12"],
  ["A20","B17","C7","C29","D22","E18","F16","G13","H14","M13"],
  ["A21","B18","C8","D1","D23","E19","F17","G14","H15","M14"],
  ["A22","B19","C9","D2","D24","E20","F18","G15","H16","M15"],
  ["A23"],
];

const allMard = [];
for (const row of ROWS) {
  for (const code of row) allMard.push(code);
}

function countInPrefix(prefix) {
  return allMard.filter(function(c) { return c.startsWith(prefix); }).length;
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  var a = s * Math.min(l, 1 - l);
  var f = function(n) {
    var k = (n + h / 30) % 12;
    return Math.round((l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)) * 255)
      .toString(16).padStart(2, "0");
  };
  return "#" + f(0) + f(8) + f(4);
}

var CATEGORIES = [
  { prefix: "A", hueStart: 50, hueEnd: 20, satLow: 60, satHigh: 90, lightHigh: 85, lightLow: 45 },
  { prefix: "B", hueStart: 80, hueEnd: 160, satLow: 50, satHigh: 85, lightHigh: 80, lightLow: 25 },
  { prefix: "C", hueStart: 195, hueEnd: 250, satLow: 40, satHigh: 90, lightHigh: 80, lightLow: 30 },
  { prefix: "D", hueStart: 260, hueEnd: 310, satLow: 40, satHigh: 80, lightHigh: 75, lightLow: 20 },
  { prefix: "E", hueStart: 330, hueEnd: 350, satLow: 30, satHigh: 85, lightHigh: 90, lightLow: 35 },
  { prefix: "F", hueStart: 0, hueEnd: 15, satLow: 60, satHigh: 95, lightHigh: 60, lightLow: 20 },
  { prefix: "G", hueStart: 20, hueEnd: 40, satLow: 30, satHigh: 70, lightHigh: 75, lightLow: 20 },
  { prefix: "M", hueStart: 0, hueEnd: 0, satLow: 0, satHigh: 10, lightHigh: 92, lightLow: 15 },
];

var H_SPECIAL = {
  H1: { hex: "#FFFFFF", nameZh: "透明" },
  H2: { hex: "#FFFFF0", nameZh: "乳白" },
  H7: { hex: "#000000", nameZh: "纯黑" },
};

var CAT_NAMES = { A:"黄橙肤", B:"绿", C:"蓝青", D:"紫", E:"粉", F:"红", G:"棕咖", H:"透白黑灰", M:"灰" };

function generateHex(code) {
  if (H_SPECIAL[code]) return H_SPECIAL[code].hex;
  var prefix = (code.match(/^[A-Z]+/) || [""])[0];
  var num = parseInt((code.match(/\d+/) || ["1"])[0], 10);

  if (prefix === "H") {
    var totalH = countInPrefix("H");
    var idx = num - 1;
    if (idx <= 3) {
      var t4 = (idx - 1) / 4;
      var l4 = 95 - t4 * 30;
      return hslToHex(30, 5, l4);
    } else {
      var t = (idx - 5) / (totalH - 5);
      var l = 80 - t * 75;
      return hslToHex(220, 3, Math.max(l, 5));
    }
  }

  var cat = CATEGORIES.find(function(c) { return c.prefix === prefix; });
  if (!cat) return "#CCCCCC";

  var catCodes = allMard.filter(function(c) { return c.startsWith(prefix); });
  var idx2 = catCodes.indexOf(code);
  var t2 = catCodes.length > 1 ? idx2 / (catCodes.length - 1) : 0.5;

  var h;
  if (cat.hueStart <= cat.hueEnd) {
    h = cat.hueStart + (cat.hueEnd - cat.hueStart) * t2;
  } else {
    var range = cat.hueEnd + 360 - cat.hueStart;
    h = (cat.hueStart + range * t2) % 360;
  }

  var s = cat.satLow + (cat.satHigh - cat.satLow) * (0.2 + t2 * 0.8);
  var l = cat.lightHigh + (cat.lightLow - cat.lightHigh) * t2;

  return hslToHex(h, s, l);
}

function generateName(code) {
  if (H_SPECIAL[code] && H_SPECIAL[code].nameZh) return H_SPECIAL[code].nameZh;
  var prefix = (code.match(/^[A-Z]+/) || [""])[0];
  var num = (code.match(/\d+/) || ["1"])[0];
  var catName = CAT_NAMES[prefix] || "";
  return catName + num;
}

function mapToBrand(mardCode, brand) {
  var prefix = (mardCode.match(/^[A-Z]+/) || [""])[0];
  var catCodes = allMard.filter(function(c) { return c.startsWith(prefix); });
  var idx = catCodes.indexOf(mardCode);
  var total = catCodes.length - 1;
  if (total < 0) total = 0;
  var t = total > 0 ? idx / total : 0;

  if (brand === "artkal") {
    var artkalRanges = { A:[1,35], B:[36,72], C:[73,102], D:[103,122], E:[123,142], F:[143,158], G:[159,168], H:[169,175], M:[169,175] };
    var r = artkalRanges[prefix];
    if (!r) return "";
    return "C" + Math.round(r[0] + (r[1] - r[0]) * t);
  }
  if (brand === "manman") {
    var mmRanges = { A:[1,30], B:[31,52], C:[53,70], D:[71,85], E:[86,102], F:[103,115], G:[116,122], H:[123,128], M:[123,128] };
    var mr = mmRanges[prefix];
    if (!mr) return "";
    return "IC" + Math.round(mr[0] + (mr[1] - mr[0]) * t);
  }
  if (brand === "coco") {
    var cocoRanges = { A:["A",1,32], B:["B",1,36], C:["C",1,28], D:["E",1,26], E:["E",1,26], F:["K",1,30], G:["K",8,30], H:["K",20,30], M:["K",20,30] };
    var cr = cocoRanges[prefix];
    if (!cr) return "";
    var cnum = Math.round(cr[1] + (cr[2] - cr[1]) * t);
    return cr[0] + cnum;
  }
  if (brand === "panpan") {
    var ppRanges = { A:[101,130], B:[131,170], C:[171,200], D:[171,200], E:[201,235], F:[236,265], G:[236,265], H:[266,322], M:[266,322] };
    var pr = ppRanges[prefix];
    if (!pr) return "";
    return String(Math.round(pr[0] + (pr[1] - pr[0]) * t));
  }
  return "";
}

var entries = [];
for (var i = 0; i < allMard.length; i++) {
  var code = allMard[i];
  var hex = generateHex(code);
  var r = parseInt(hex.slice(1,3), 16);
  var g = parseInt(hex.slice(3,5), 16);
  var b = parseInt(hex.slice(5,7), 16);
  var nameZh = generateName(code);
  var isSpec = code === "H1" || code === "H2" || code === "H7";
  var isTrans = code === "H1";

  var cat = "neutral";
  var pf = (code.match(/^[A-Z]+/) || [""])[0];
  if (pf === "A") cat = "yellow";
  else if (pf === "B") cat = "green";
  else if (pf === "C") cat = "blue";
  else if (pf === "D") cat = "purple";
  else if (pf === "E") cat = "pink";
  else if (pf === "F") cat = "red";
  else if (pf === "G") cat = "brown";
  else if (isSpec) cat = "special";

  entries.push({
    id: "mard-" + code.toLowerCase(),
    name: nameZh,
    nameZh: nameZh,
    codes: {
      mard: code,
      artkal: mapToBrand(code, "artkal"),
      manman: mapToBrand(code, "manman"),
      coco: mapToBrand(code, "coco"),
      panpan: mapToBrand(code, "panpan"),
    },
    rgb: { r: r, g: g, b: b },
    hex: hex,
    category: cat,
    special: isSpec,
    transparent: isTrans,
  });
}

var ts = "// Auto-generated 221-color 5-brand bead library\n";
ts += "// MARD baseline A-H,M prefix (221) | Artkal-C 175 | 漫漫 IC128 | COCO 174 | 盼盼 222\n";
ts += "import type { BeadColor } from \"./types\";\n\n";
ts += "export const BEAD_LIBRARY: readonly BeadColor[] = [\n";

for (var j = 0; j < entries.length; j++) {
  var e = entries[j];
  ts += "  {\n";
  ts += "    id: \"" + e.id + "\",\n";
  ts += "    name: \"" + e.name + "\",\n";
  ts += "    nameZh: \"" + e.nameZh + "\",\n";
  ts += "    codes: { mard: \"" + e.codes.mard + "\", artkal: \"" + e.codes.artkal + "\", manman: \"" + e.codes.manman + "\", coco: \"" + e.codes.coco + "\", panpan: \"" + e.codes.panpan + "\" },\n";
  ts += "    rgb: { r: " + e.rgb.r + ", g: " + e.rgb.g + ", b: " + e.rgb.b + " },\n";
  ts += "    hex: \"" + e.hex + "\",\n";
  ts += "    category: \"" + e.category + "\",\n";
  if (e.special) ts += "    special: true,\n";
  if (e.transparent) ts += "    transparent: true,\n";
  ts += "  }";
  if (j < entries.length - 1) ts += ",";
  ts += "\n";
}

ts += "];\n\n";
ts += "export const BEAD_MAP: Map<string, BeadColor> = new Map(BEAD_LIBRARY.map(b => [b.id, b]));\n";
ts += "export const BEAD_COUNT = BEAD_LIBRARY.length; // " + entries.length + " colors\n";

fs.writeFileSync("lib/bead-library-generated.ts", ts);
console.log("Generated " + entries.length + " colors");
for (var k = 0; k < CATEGORIES.length; k++) {
  var c = CATEGORIES[k];
  console.log("  " + c.prefix + ": " + countInPrefix(c.prefix) + " colors");
}
console.log("  H: " + countInPrefix("H") + " colors");
