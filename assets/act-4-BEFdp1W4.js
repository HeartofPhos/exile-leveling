const e=`#section Act 4
➞ {enter|1_4_1} #The Aqueduct
➞ {enter|1_4_town} #Highgate
➞ {enter|1_4_2} #The Dried Lake
Find and kill {kill|Voll, Emperor of Purity}, take {quest_text|Deshret's Banner}
    #sub Recommended Level: 30
Get {crafting}
{logout}
Hand in {quest|a4q2} #Breaking the Seal
➞ {enter|1_4_3_1} #The Mines Level 1
Get {crafting}
➞ {enter|1_4_3_2} #The Mines Level 2
Free {quest_text|Deshret}
➞ {enter|1_4_3_3} #The Crystal Veins
Get {crafting}
{waypoint|1_4_town} #Highgate
Hand in {quest|a4q6} #An Indomitable Spirit
{waypoint|1_3_town} #The Sarn Encampment
➞ {enter|Labyrinth_Airlock}, get {waypoint_get} #Aspirants' Plaza
{ascend|normal}
Get {crafting|1_Labyrinth_boss_3}
{waypoint|1_4_3_3} #The Crystal Veins
➞ {enter|1_4_5_1} #Daresso's Dream
➞ {enter|1_4_5_2} #The Grand Arena
Get {crafting}
{waypoint|1_4_3_3} #The Crystal Veins
➞ {enter|1_4_4_1} #Kaom's Dream
➞ {enter|1_4_4_3} #Kaom's Stronghold
    #sub Go {dir|45}
    #sub Follow Bridges
Get {crafting}
➞ {arena|Caldera of the King}, kill {kill|King Kaom}, take {quest_text|The Eye of Fury}
{portal|use}
{waypoint|1_4_5_2} #The Grand Arena
➞ {arena|The Ring of Blades}, kill {kill|Daresso, King of Swords}, take {quest_text|The Eye of Desire}
    #sub Go {dir|225} follow the exits keeping {dir|270}
{logout}
{waypoint|1_4_3_3} #The Crystal Veins
Talk to {generic|Lady Dialla}
➞ {enter|1_4_6_1} #The Belly of the Beast Level 1
➞ {enter|1_4_6_2} #The Belly of the Beast Level 2
➞ {arena|The Bowels of the Beast}, kill {kill|Piety, the Abomination}
Talk to {generic|Piety}
Get {crafting}
➞ {enter|1_4_6_3} #The Harvest
Find and kill {kill|Doedre Darktongue}, take {quest_text|Malachai's Lungs}
Find and kill {kill|Maligaro, The Inquisitor}, take {quest_text|Malachai's Heart}
Find and kill {kill|Shavronne of Umbra}, take {quest_text|Malachai's Entrails}
Hand in {quest|a4q5} #Corpus Malachus
➞ {arena|The Black Core}, kill {kill|Malachai, The Nightmare}
    #sub Recommended Level: 34-35
{logout}
Hand in {quest|a4q1} #The Eternal Nightmare
➞ {enter|1_4_7} #The Ascent
Get {crafting}
Activate {quest_text|The Resonator}, use {quest_text|Oriath Portal}
`;export{e as default};
