const e=`#section Act 5
➞ {enter|1_5_1} #The Slave Pens
Find and kill {kill|Overseer Krow}
    #sub Go {dir|180} as much as possible
    #sub Go {dir|270}
➞ {enter|1_5_town} #Overseer's Tower
Hand in {quest|a5q1b} #Return to Oriath
➞ {enter|1_5_2} #The Control Blocks
Find and take {quest_text|Miasmeter}
    #sub Go {dir|270} as much as possible
Find and kill {kill|Justicar Casticus}, take {quest_text|Eyes of Zeal}
    #sub Go {dir|45} from {quest_text|Miasmeter}
➞ {enter|1_5_3} #Oriath Square
➞ {enter|1_5_4} #The Templar Courts
    #sub Go {dir|45}
➞ {enter|1_5_5} #The Chamber of Innocence
    #sub Loop around clockwise
    #sub Recommended Level: 37+
    #sub Farm Level: 40-42
Get {crafting}
➞ {arena|Sanctum of Innocence}, kill {kill|High Templar Avarius}
    #sub Go {dir|315} counter-clockwise spiral
{logout}
Hand in {quest|a5q2} #The Key to Freedom
Hand in {quest|a5q3} #In Service to Science
Hand in {quest|a5q4} #Death to Purity
{waypoint|1_5_5} #The Chamber of Innocence
➞ {enter|1_5_4b} #The Torched Courts
➞ {enter|1_5_3b} #The Ruined Square
    #sub Loop around counter-clockwise
Get {waypoint_get}
    #sub Go {dir|315}
➞ {enter|1_5_6} #The Ossuary
Find and take {quest_text|Sign of Purity}
Get {crafting}
{logout}
{waypoint|1_5_3b} #The Ruined Square
➞ {enter|1_5_7} #The Reliquary
    #sub Go {dir|225} find the plaza
    #sub Go {dir|180}
Find 3x{quest_text|Kitava's Torment}, search in the corners of the map
Get {crafting}
{logout}
Hand in {quest|a5q7} #Kitava's Torments
{waypoint|1_5_3b} #The Ruined Square
➞ {enter|1_5_8} #The Cathedral Rooftop
    #sub Go {dir|225}
➞ {arena|Cathedral Apex}, kill {kill|Kitava, the Insatiable}
Talk to {generic|Lilly Roth}, Sail to Wraeclast
`;export{e as default};
