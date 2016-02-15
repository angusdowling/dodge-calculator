// fRate
var fRate = 0;

// Gems being used to increase upgrade success
var Dst = [2, 2, 2, 2]

// For each gem, increase rate by its value
// Else increase by base 0.125.
for(i = 0; i < Dst.length; i++)
{
  if ( Dst[i] )
  {
    fRate = fRate + (Dst[i]);
  }

  else
  {
    var v10 = fRate + 0.125;
    fRate = v10;
  }
}


var ItemGrade = 8;   // Grade of item
var TalicAmount = 4; // Amount of talics already inserted
var ItemLevel = 50;  // Item level

var SuccessUpgrade = [
  [1000, 750, 500, 250, 100, 50, 0], // 0.] Normal
  [1000, 750, 500, 250, 100, 50, 0], // 1.] Type B
  [1000, 750, 500, 250, 100, 50, 0], // 2.] Type A
  [1000, 750, 500, 250, 100, 50, 0], // 3.] Type C
  [328, 246, 164, 82, 49, 16, 0],    // 4.] Blue Relic
  [640, 480, 320, 160, 96, 32, 0],   // 5.] Antigrav
  [512, 384, 256, 128, 77, 26, 0],   // 6.] Blue Relic
  [410, 307, 205, 102, 61, 20, 0],   // 7.] Green Relic
  [800, 600, 400, 200, 120, 40, 0],  // 8.] Leons
  [262, 192, 131, 66, 39, 13, 0],    // 9.] PVP Weapon ?
  [210, 157, 105, 52, 31, 10, 0]     // 10.] ??
];

// Old way
var dwTotalRate = Math.floor(((( 1000 + 7 * ItemGrade + TalicAmount) * fRate ) /4 ) * 100)

// New way?
var dwTotalRate = Math.floor(((( SuccessUpgrade[ItemGrade][TalicAmount] + 7 * ItemGrade + TalicAmount) * fRate) / 4) * 100);

if ( ItemLevel > 0 )
{
  dwTotalRate = Math.floor(dwTotalRate * (30 / ItemLevel));
}

var dwR1 = Math.random();
var dwR2 = dwR1 << 16;
var dwRand = Math.random() + dwR2;

console.log(dwTotalRate);