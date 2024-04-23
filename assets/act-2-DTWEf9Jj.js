const e=`#section Act 2
➞ {enter|1_2_1} #The Southern Forest
➞ {enter|1_2_town} #The Forest Encampment
➞ {enter|1_2_2} #The Old Fields
    #sub Go {dir|45}
#ifdef LEAGUE_START
    Find {area|1_2_2a}, place {portal|set} #The Den
#endif
➞ {enter|1_2_3} #The Crossroads
    #sub Follow the road
#ifdef LEAGUE_START
    {waypoint|1_2_town} #The Forest Encampment
        #sub Follow the road
    Take {portal|use}
    ➞ {enter|1_2_2a} #The Den
    Find and kill {kill|The Great White Beast}
    {logout}
    Hand in {quest|a2q10} #The Great White Beast
    {waypoint|1_2_3} #The Crossroads
#endif
#ifndef LEAGUE_START
    Get {waypoint_get}
#endif
➞ {enter|1_2_6_1} #The Chamber of Sins Level 1
    #sub Go {dir|315}
➞ {enter|1_2_6_2} #The Chamber of Sins Level 2
    #sub Go in same direction as {waypoint}
#ifdef LEAGUE_START
    Complete {trial}
#endif
Kill {kill|Fidelitas, the Mourning}, take {quest_text|Baleful Gem}
    #sub Look for the long hallway
    #sub Recommended Level: 14-15
{logout}
Hand in {quest|a2q6} #Intruders in Black
#ifdef LEAGUE_START
    {waypoint|1_2_3} #The Crossroads
    ➞ {enter|1_2_15} #The Fellshrine Ruins
        #sub Go {dir|135}
    ➞ {enter|1_2_5_1} #The Crypt Level 1
        #sub Follow the road
    Complete {trial}
    {logout}
#endif
➞ {enter|1_2_7} #The Riverways
    #sub Go {dir|225}
Get {waypoint_get}
    #sub Follow the road
➞ {enter|1_2_9} #The Western Forest
    #sub Follow the road
Get {waypoint_get}
    #sub Follow the road
➞ {enter|1_2_10} #The Weaver's Chambers
    #sub Search the side of road opposite {waypoint}
➞ {arena|The Weaver's Nest}, kill {kill|The Weaver}, take {quest_text|Maligaro's Spike}
    #sub Try go {dir|270}, if it's blocked go {dir|45}
    #sub Recommended Level: 16
{logout}
Hand in {quest|a2q4} #Sharp and Cruel
#ifdef BANDIT_KILL
    {waypoint|1_2_3} #The Crossroads
    ➞ {enter|1_2_4} #The Broken Bridge
        #sub Go {dir|45}
    Kill {kill|Kraityn, Scarbearer}, take {quest_text|Kraityn's Amulet}
        #sub Follow the road
    {logout}
    {waypoint|1_2_7} #The Riverways
    ➞ {enter|1_2_12} #The Wetlands
        #sub Look for 2 pillars near {waypoint}, follow the trail
    Find and kill {kill|Oak, Skullbreaker}, take {quest_text|Oak's Amulet}
    {waypoint|1_2_9} #The Western Forest
        #sub Search opposite direction of the encampment entrance
    Kill {kill|Alira Darktongue}, take {quest_text|Alira's Amulet}
        #sub Go {dir|180} look for the torch touching the road
        #sub Follow the trail in the direction of the torch
    Kill {kill|Captain Arteri}
        #sub Follow the road {dir|225}
    Take {quest_text|Thaumetic Emblem}, activate {quest_text|Thaumetic Seal}
    {logout}
    Hand in {quest|a2q7}, take {quest_text|The Apex} #Deal with the Bandits
    {waypoint|1_1_town} #Lioneye's Watch
    Hand in {quest|a1q9} #The Way Forward
    {waypoint|1_2_12} #The Wetlands
    Poison the {quest_text|Tree Roots} ➞ {enter|1_2_11} #The Vaal Ruins
#endif
#ifdef BANDIT_ALIRA
    {waypoint|1_2_3} #The Crossroads
    ➞ {enter|1_2_4} #The Broken Bridge
        #sub Go {dir|45}
    Kill {kill|Kraityn, Scarbearer}, take {quest_text|Kraityn's Amulet}
        #sub Follow the road
    {logout}
    {waypoint|1_2_7} #The Riverways
    ➞ {enter|1_2_12} #The Wetlands
        #sub Look for 2 pillars near {waypoint}, follow the trail
    Find and kill {kill|Oak, Skullbreaker}, take {quest_text|Oak's Amulet}
    {waypoint|1_2_9} #The Western Forest
        #sub Search opposite direction of the encampment entrance
    Help {kill|Alira Darktongue}, take {quest_text|The Apex}
        #sub Go {dir|180} look for the torch touching the road
        #sub Follow the trail in the direction of the torch
    Kill {kill|Captain Arteri}
        #sub Follow the road {dir|225}
    Take {quest_text|Thaumetic Emblem}, activate {quest_text|Thaumetic Seal}
    {logout}
    {waypoint|1_1_town} #Lioneye's Watch
    Hand in {quest|a1q9} #The Way Forward
    {waypoint|1_2_12} #The Wetlands
    Poison the {quest_text|Tree Roots} ➞ {enter|1_2_11} #The Vaal Ruins
#endif
#ifdef BANDIT_KRAITYN
    {waypoint|1_2_7} #The Riverways
    ➞ {enter|1_2_12} #The Wetlands
        #sub Look for 2 pillars near {waypoint}, follow the trail
    Find and kill {kill|Oak, Skullbreaker}, take {quest_text|Oak's Amulet}
    {waypoint|1_2_9} #The Western Forest
        #sub Search opposite direction of the encampment entrance
    Kill {kill|Alira Darktongue}, take {quest_text|Alira's Amulet}
        #sub Go {dir|180} look for the torch touching the road
        #sub Follow the trail in the direction of the torch
    Kill {kill|Captain Arteri}
        #sub Follow the road {dir|225}
    Take {quest_text|Thaumetic Emblem}, activate {quest_text|Thaumetic Seal}
    {logout}
    {waypoint|1_1_town} #Lioneye's Watch
    Hand in {quest|a1q9} #The Way Forward
    {waypoint|1_2_3} #The Crossroads
    ➞ {enter|1_2_4} #The Broken Bridge
        #sub Go {dir|45}
    Help {kill|Kraityn, Scarbearer}, take {quest_text|The Apex}
        #sub Follow the road
    {logout}
    {waypoint|1_2_12} #The Wetlands
    Poison the {quest_text|Tree Roots} ➞ {enter|1_2_11} #The Vaal Ruins
#endif
#ifdef BANDIT_OAK
    {waypoint|1_2_3} #The Crossroads
    ➞ {enter|1_2_4} #The Broken Bridge
        #sub Go {dir|45}
    Kill {kill|Kraityn, Scarbearer}, take {quest_text|Kraityn's Amulet}
        #sub Follow the road
    {logout}
    {waypoint|1_2_9} #The Western Forest
    Kill {kill|Alira Darktongue}, take {quest_text|Alira's Amulet}
        #sub Go {dir|180} look for the torch touching the road
        #sub Follow the trail in the direction of the torch
    Kill {kill|Captain Arteri}
        #sub Follow the road {dir|225}
    Take {quest_text|Thaumetic Emblem}, activate {quest_text|Thaumetic Seal}
    {logout}
    {waypoint|1_1_town} #Lioneye's Watch
    Hand in {quest|a1q9} #The Way Forward
    {waypoint|1_2_7} #The Riverways
    ➞ {enter|1_2_12} #The Wetlands
        #sub Look for 2 pillars near {waypoint}, follow the trail
    Find and help {kill|Oak, Skullbreaker}, take {quest_text|The Apex}
    Poison the {quest_text|Tree Roots} ➞ {enter|1_2_11} #The Vaal Ruins
        #sub Search opposite direction of the encampment entrance
#endif
➞ {enter|1_2_8} #The Northern Forest
    #sub S shape or L shape leads to exit
➞ {enter|1_2_14_2} #The Caverns
Get {crafting}
➞ {enter|1_2_14_3} #The Ancient Pyramid
➞ {arena|Pyramid Apex}, kill {kill|Vaal Oversoul}
    #sub First floor exit will be in one of the 3 corners
    #sub Remaining floors will have the exit diagonally across from the entrance
    #sub Recommended Level: 20-22
Get {crafting}
`;export{e as default};
