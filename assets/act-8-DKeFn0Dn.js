const e=`#section Act 8
➞ {enter|2_8_1} #The Sarn Ramparts
➞ {enter|2_8_town} #The Sarn Encampment
➞ {enter|2_8_2_1} #The Toxic Conduits
    #sub Go {dir|270}
➞ {enter|2_8_2_2} #Doedre's Cesspool
    #sub Black splashes of paint on ground points to the right direction to go
➞ {arena|The Cauldron}, kill {kill|Doedre the Vile}
➞ {arena|Sewer Outlet}
Get {crafting}
➞ {enter|2_8_8} #The Quay
    #sub Go {dir|45}
Find and take {quest_text|Ankh of Eternity}
    #sub Follow {dir|270} wall
➞ {arena|Resurrection Site}
    #sub Go {dir|135}
Talk to {generic|Clarissa}, kill {kill|Tolman}
➞ {enter|2_8_9} #The Grain Gate
Find and kill {kill|Gemling Legionnaires}
    #sub Follow the dead guards by doorways
➞ {enter|2_8_10} #The Imperial Fields
    #sub Follow the dead guards by doorways
➞ {enter|2_8_12_1} #The Solaris Temple Level 1
    #sub Follow the road until {waypoint}
    #sub Go {dir|315}
Get {waypoint_get}
➞ {enter|2_8_12_2} #The Solaris Temple Level 2
Find and kill {kill|Dawn, Harbinger of Solaris}, take {quest_text|Sun Orb}
Get {crafting}
{logout}
Hand in {quest|a8q1} #Essence of the Hag
Hand in {quest|a8q7} #The Gemling Legion
Hand in {quest|a8q6} #Love is Dead
{waypoint|2_8_12_1} #The Solaris Temple Level 1
➞ {enter|2_8_11} #The Solaris Concourse
➞ {enter|2_8_13} #The Harbour Bridge
    #sub Go {dir|225}
➞ {enter|2_8_6} #The Lunaris Concourse
Get {waypoint_get}
    #sub Go {dir|315}
➞ {enter|2_8_7_1_} #The Lunaris Temple Level 1
➞ {enter|2_8_7_2} #The Lunaris Temple Level 2
Find and kill {kill|Dusk, Harbinger of Lunaris}, take {quest_text|Moon Orb}
Get {crafting}
{logout}
{waypoint|2_8_6} #The Lunaris Concourse
➞ {enter|2_8_13} #The Harbour Bridge
    #sub Go {dir|135}
➞ {arena|The Sky Shrine}, activate {generic|Statue of the Sisters}
Kill {kill|Lunaris, Eternal Moon} & {kill|Solaris, Eternal Sun}
➞ {enter|2_9_1} #The Blood Aqueduct
    #sub Recommended Level: 54+
    #sub Farm Level: 58-62
➞ {enter|2_9_town} #Highgate
{waypoint|2_8_6} #The Lunaris Concourse
➞ {enter|2_8_5} #The Bath House
    #sub Go {dir|180}
#ifdef LEAGUE_START
    Complete {trial}
        #sub Search {dir|270} side
    Get {crafting}
#endif
➞ {enter|2_8_4} #The High Gardens
    #sub Search {dir|270} side
➞ {arena|The Pools of Terror}, kill {kill|Yugul, Reflection of Terror}
{portal|use}
Hand in {quest|a8q4} #Reflection of Terror
`;export{e as default};
