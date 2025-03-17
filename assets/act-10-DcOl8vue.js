const n=`#section Act 10
{waypoint|2_10_town} #Oriath Docks
➞ {enter|2_10_1} #The Cathedral Rooftop
➞ {arena|Cathedral Apex}, kill {kill|Plaguewing}
    #sub Go {dir|0}
➞ {enter|2_10_2} #The Ravaged Square
Place {portal|set} in the plaza
➞ {enter|2_10_7} #The Control Blocks
    #sub Go {dir|180}
{waypoint|2_10_town} #Oriath Docks
Hand in {quest|a10q1} #Safe Passage
Take {portal|use}
Get {waypoint_get}
    #sub Go {dir|45}
#ifdef LEAGUE_START
    ➞ {enter|2_10_9} #The Ossuary
    Get {crafting}
    Complete {trial}
#endif
{logout}
{waypoint|Labyrinth_Airlock}
{ascend|merciless}
Get {crafting|3_Labyrinth_boss_3}
{waypoint|2_10_7} #The Control Blocks
Find and kill {kill|Vilenta}
{logout}
Hand in {quest|a10q6} #Vilenta's Vengeance
{waypoint|2_10_2} #The Ravaged Square
➞ {enter|2_10_3} #The Torched Courts
    #sub Go {dir|135}
➞ {enter|2_10_4} #The Desecrated Chambers
    #sub Loop around clockwise
Get {crafting}
➞ {arena|Sanctum of Innocence}, kill {kill|Avarius, Reassembled}, take {quest_text|The Staff of Purity}
    #sub Go {dir|315} counter-clockwise spiral
{logout}
Talk to {generic|Bannon}
Hand in {quest|a10q2} #Death and Rebirth
{waypoint|2_10_2} #The Ravaged Square
Talk to {generic|Innocence}
    #sub Go {dir|45}
➞ {enter|2_10_5} #The Canals
➞ {enter|2_10_6} #The Feeding Trough
Get {crafting}
Talk to {generic|Sin}
➞ {arena|Altar of Hunger}, kill {kill|Kitava, the Insatiable}
Talk to {generic|Sin} ➞ {enter|2_10_town} #Oriath Docks
Talk to {generic|Lilly Roth}, Set Sail from Oriath
➞ {enter|2_11_endgame_town} #Karui Shores
Get {crafting}
#ifdef BANDIT_KILL
    Hand in {quest|a10q3} #An End to Hunger
        #sub Type {generic|/passives} in chat to confirm that you have all 24 passives from quests
#endif
#ifndef BANDIT_KILL
    Hand in {quest|a10q3} #An End to Hunger
        #sub Type {generic|/passives} in chat to confirm that you have all 22 passives from quests
#endif`;export{n as default};
