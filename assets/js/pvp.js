// definitions
// -------------------------


var characterLevel =        50;
var characterAccuracy =     1; // Accuracy (Close range armor(25) + accuracy(30) + grace(30))
var isRidingUnit =          false;
var meleeMastery =          99;
var rangeMastery =          99;
var target =                0;

var defenderLevel =         50;
var defenderDefMastery =    99;
var defenderEvasion =       1; // Evasion (+6 boots (75) + 20/20 ring *2 (40) + agility (30) + evasion (30) + 10 dodge amulet * 2 (20) + 1)

// Type
var type_knife =            0;
var type_sword =            1;
var type_axe =              2;
var type_mace =             3;
var type_spear =            4;
var type_bow =              5;
var type_firearm =          6;
var type_luancher =         7;
var type_throw =            8;
var type_staff =            9;
var type_mine =             10;
var wp_type_num =           11;

// Class
var attack_range_short =    0;
var attack_range_long =     1;
    

var wp_class_close =        attack_range_short;
var wp_class_long =         attack_range_long;

// Utility

var max_record_num =        100;
var max_table_num =         10;

// Time
var d = new Date();
var n = d.getTime();

var result = [];

//var s_wRecord = [max_table_num][max_record_num];  

var s_bRecordSet;
var s_wRecord = new Array(max_table_num);
for (var i = 0; i < 10; i++) {
  s_wRecord[i] = new Array(max_record_num);
}

var m_wCurTable =           0;
var m_wCurPoint =           0;

// Other
var success =               true;
var missAmount =            0;
var hitAmount =             0;

var m_pmWpn = {
  byWpType: type_knife
};


// Random Generator
function _100_per_random_table(){
  if(!s_bRecordSet)
  {
    s_bRecordSet = true;

    Math.seedrandom(n);
    for(t = 0; t < max_table_num; t++)
    {
      for(r = 0; r < max_record_num; r++)
        s_wRecord[t][r] = r;
    }

    reset();
  }

  m_wCurTable = Math.round(Math.random() * max_table_num);
  m_wCurPoint = 0;
}

function reset(){
  for(t = 0; t < max_table_num; t++)
  {
    for(i = 0; i < max_record_num; i++)
    {
      var wFrom = Math.round(Math.random() * max_record_num);
      var wToIndex  = Math.round(Math.random() * max_record_num);

      var wBuf = s_wRecord[t][wToIndex];
      s_wRecord[t][wToIndex] = s_wRecord[t][wFrom];
      s_wRecord[t][wFrom] = wBuf;
    }
  }     
}

function GetRand(){
  if(m_wCurPoint >= max_record_num)
  {
    m_wCurTable = Math.round(Math.random() * max_table_num);
    m_wCurPoint = 0;
  }

  var wR = s_wRecord[m_wCurTable][m_wCurPoint];

  m_wCurPoint++;

  console.log("Rand", wR);

  return wR;  
}

// Probability Calculation
function GetGenAttackProb(){
  var fWSkill;

  if(m_pmWpn.byWpType === 255)
  {
    fWSkill = 10;
  }

  else if(m_pmWpn.byWpType === type_staff)
  {
    fWSkill = 10; 
  }

  // Melee Mastery is hard coded. It is supposed to check what type of weapon (ranged or melee) then apply the appropriate mastery.
  else
  {
    fWSkill = meleeMastery;
  }

  var fOneRate = 1;

  if(!isRidingUnit)
  {
      fOneRate = characterLevel * 1 + fWSkill;
  }

  else
  {
    // Unit calculation here
  }

  var fDstRate = 0;

  // Target is player
  if(target === 0)
  {
    fDstRate = defenderLevel * 1 + defenderDefMastery;
  }

  // Target is monster
  else if (target === 1)
  {
    fDstRate = defenderDefMastery;
  }

  var nTotalRate = (fOneRate - fDstRate) / 4 + 70;

  console.log("After masteries and levels", nTotalRate);

  var fRate = [0.23, 0.22, 0.18, 0.17, 0.20];
  var fPartRate = 5 * fRate[Math.floor(Math.random() * fRate.length)];
  nTotalRate *= fPartRate;

  console.log("After part is chosen", nTotalRate);

  var nEffHitRate = characterAccuracy;  
  var nEffAvdRate = defenderEvasion; 

  nTotalRate += (nEffHitRate - nEffAvdRate);

  console.log("After accuracy / evasion", nTotalRate);

  nTotalRate = Math.max(nTotalRate, 5);
  nTotalRate = Math.min(nTotalRate, 95);

  console.log("Final hitrate", nTotalRate);

  return nTotalRate;
}

// Attack function
function genAttack(){
  console.log('attack');
  if( GetRand() >= GetGenAttackProb() )
  {
    success = false;

    $('.result').html("Miss!");

    missAmount++;
  }

  else
  {
    $('.result').html("Hit!");

    hitAmount++;
  }
}

function gatherVariables(){
  characterLevel =        parseInt($('#cLvl').val(), 10);
  characterAccuracy =     parseInt($('#cAccuracy').val(), 10);
  meleeMastery =          parseInt($('#cWepMastery').val(), 10);

  defenderLevel =         parseInt($('#dLvl').val(), 10);
  defenderDefMastery =    parseInt($('#dDefMastery').val(), 10);
  defenderEvasion =       parseInt($('#dEvasion').val(), 10);
}

function simulationStart(amount){
  gatherVariables();

  var i = 0;

  missAmount = 0;
  hitAmount = 0;

  if(!isNaN(characterLevel) && !isNaN(characterAccuracy) && !isNaN(meleeMastery) && !isNaN(defenderLevel) && !isNaN(defenderDefMastery) && !isNaN(defenderEvasion) )
  {
    while(i < amount){
      genAttack();
      i++;
    }

    $('.resultsContainer .mCount').html("Hits Failed (missed): " + missAmount);
    $('.resultsContainer .hCount').html("Hit Succeeded: " + hitAmount);
  }

  else
  {
    console.log("characterLevel", characterLevel);
    console.log("characterAccuracy", characterAccuracy);
    console.log("meleeMastery", meleeMastery);
    console.log("defenderLevel", defenderLevel);
    console.log("defenderDefMastery", defenderDefMastery);
    console.log("defenderEvasion", defenderEvasion);

    $('.resultsContainer .mCount').html('Please insert values into the fields.');
  }
}



