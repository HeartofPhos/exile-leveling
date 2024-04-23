const e=`#section Act 1
Find and kill {kill|Hillock}
➞ {enter|1_1_town} #Lioneye's Watch
Hand in {quest|a1q1} #Enemy at the Gate
➞ {enter|1_1_2} #The Coast
#ifdef LEAGUE_START
    Get {waypoint_get}
#endif
➞ {enter|1_1_3} #The Mud Flats
Find 3x{quest_text|Glyph}
    #sub Little streams connect the 3 Rhoa nests
    #sub Usually form a triangle, but will rarely form a line
➞ {enter|1_1_4_1} #The Submerged Passage
#ifdef LEAGUE_START
    {waypoint|1_1_2} #The Coast
    ➞ {enter|1_1_2a} #The Tidal Island
    Find and kill {kill|Hailrake}, take {quest_text|Medicine Chest}
        #sub Go {dir|270}
        #sub If you find a ledge, turn around and go {dir|90}
        #sub Recommended Level: 4
    {logout}
    Hand in {quest|a1q4} #Breaking Some Eggs
    Hand in {quest|a1q5} #Mercy Mission
#endif
#ifndef LEAGUE_START
    {waypoint|1_1_town} #Lioneye's Watch
    Hand in {quest|a1q5} #Mercy Mission
#endif
{waypoint|1_1_4_1} #The Submerged Passage
Find bridge, place {portal|set}
➞ {enter|1_1_5} #The Ledge
➞ {enter|1_1_6} #The Climb
➞ {enter|1_1_7_1} #The Lower Prison
{waypoint|1_1_town} #Lioneye's Watch
Take {portal|use}
➞ {enter|1_1_4_0} #The Flooded Depths
    #sub Go right of the bridge
Find and kill {kill|The Dweller of the Deep}
    #sub Search opposite the entrance
    #sub Look for the large empty room
{logout}
Hand in {quest|a1q7} #The Dweller of the Deep
Hand in {quest|a1q2|a1q2b} #The Caged Brute
{waypoint|1_1_7_1} #The Lower Prison
#ifdef LEAGUE_START
    Complete {trial}
        #sub Usually {dir|45}
#endif
➞ {enter|1_1_7_2} #The Upper Prison
➞ {arena|The Warden's Quarters}, kill {kill|Brutus, Lord Incarcerator}
    #sub Recommended Level: 8-10
{logout}
Hand in {quest|a1q2|a1q2} #The Caged Brute
{waypoint|1_1_8} #Prisoner's Gate
➞ {enter|1_1_9} #The Ship Graveyard
    #sub Go down the ledge next to the road
Get {waypoint_get}
Find {area|1_1_9a}, place {portal|set} #The Ship Graveyard Cave
➞ {enter|1_1_11_1} #The Cavern of Wrath
{waypoint|1_1_town} #Lioneye's Watch
Take {portal|use}
➞ {enter|1_1_9a} #The Ship Graveyard Cave
Find {quest_text|Slave Girl}, take {quest_text|Allflame}
    #sub Search opposite the entrance
➞ {enter|1_1_9}, kill {kill|Captain Fairgraves} #The Ship Graveyard
{logout}
Hand in {quest|a1q6} #The Marooned Mariner
Hand in {quest|a1q3} #The Siren's Cadence
{waypoint|1_1_11_1} #The Cavern of Wrath
➞ {enter|1_1_11_2} #The Cavern of Anger
    #sub Follow the water
➞ {arena|Merveil's Lair}, kill {kill|Merveil, the Siren}
    #sub Follow the water
    #sub Recommended Level: 11-13
`;export{e as default};
