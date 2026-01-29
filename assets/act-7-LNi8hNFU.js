const e=`#section Act 7
{waypoint|2_7_town} #The Bridge Encampment
➞ {enter|2_7_1} #The Broken Bridge
#ifdef LEAGUE_START
    Find and take {quest_text|Silver Locket}
        #sub Follow the road, look for the broken {waypoint}
#endif
➞ {enter|2_7_2} #The Crossroads
    #sub Follow the road
Get {waypoint_get}
➞ {enter|2_7_3} #The Fellshrine Ruins
    #sub Go {dir|135}
➞ {enter|2_7_4} #The Crypt
    #sub Follow the road
#ifdef LEAGUE_START
    Complete {trial}
    Get {crafting}
#endif
Find {generic|Sarcophagus} to next floor
Find and take {quest_text|Maligaro's Map}
{logout}
{waypoint|2_7_2} #The Crossroads
➞ {enter|2_7_5_1} #The Chamber of Sins Level 1
    #sub Go {dir|315}
Get {crafting}
Get {waypoint_get}
Activate {quest_text|Map Device} with {quest_text|Maligaro's Map}
➞ {enter|2_7_5_map} #Maligaro's Sanctum
➞ {arena|Maligaro's Workshop}, kill {kill|Maligaro, the Artist}, take {quest_text|Black Venom}
    #sub Follow edges of the zone and cross bridges in the corners
    #sub Typically bridges spawn in the opposite diagonal corners
{logout}
Hand in {quest|a7q2} #Essence of the Artist
#ifdef LEAGUE_START
    Hand in {quest|a7q5} #The Silver Locket
#endif
{waypoint|2_7_5_1} #The Chamber of Sins Level 1
Hand in {quest|a7q3}, take {quest_text|Obsidian Key} #Web of Secrets
➞ {enter|2_7_5_2} #The Chamber of Sins Level 2
    #sub Go in same direction as {waypoint}
#ifdef LEAGUE_START
    Complete {trial}
    Get {crafting}
#endif
Open {generic|Secret Passage} ➞ {enter|2_7_6} #The Den
➞ {enter|2_7_7} #The Ashen Fields
➞ {arena|The Forest Encampment}, kill {kill|Greust, Lord of the Forest}
    #sub Go {dir|225}
➞ {enter|2_7_8} #The Northern Forest
{waypoint|2_7_town} #The Bridge Encampment
Hand in {quest|a7q1} #The Master of a Million Faces
{waypoint|2_6_8} #Prisoner's Gate
➞ {arena|Valley of the Fire Drinker}, kill {kill|Abberath, the Cloven One}
    #sub Go down the ledge next to the road
{portal|use}
Hand in {quest|a6q7} #The Cloven One
{waypoint|2_7_8} #The Northern Forest
➞ {enter|2_7_10} #The Causeway
Get {crafting}
Find and take {quest_text|Kishara's Star}
➞ {enter|2_7_11} #The Vaal City
Find {waypoint_get}
{waypoint|2_7_8} #The Northern Forest
➞ {enter|2_7_9} #The Dread Thicket
Find and take 7x{quest_text|Firefly}
Get {crafting}
➞ {arena|Den of Despair}, kill {kill|Gruthkul, Mother of Despair}
{portal|use}
Hand in {quest|a7q9} #Queen of Despair
Hand in {quest|a7q6} #Kishara's Star
{waypoint|Labyrinth_Airlock} #Aspirants' Plaza
{ascend|cruel}
Get {crafting|2_Labyrinth_boss_3}
{waypoint|2_7_11} #The Vaal City
Hand in {quest|a7q7} #Lighting the Way
➞ {enter|2_7_12_1} #The Temple of Decay Level 1
➞ {enter|2_7_12_2} #The Temple of Decay Level 2
Get {crafting}
➞ {arena|Arakaali's Web}, kill {kill|Arakaali, Spinner of Shadows}
`;export{e as default};
