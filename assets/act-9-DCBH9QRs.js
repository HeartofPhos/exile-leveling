const e=`#section Act 9
{waypoint|2_9_town} #Highgate
➞ {enter|2_9_2} #The Descent
➞ {enter|2_9_3} #The Vastiri Desert
Get {waypoint_get}
    #sub Go {dir|90}
Get {crafting}
Find and take {quest_text|The Storm Blade}
➞ {enter|2_9_5} #The Foothills
    #sub Go {dir|315}
Get {waypoint_get}
    #sub Go {dir|45} until you find the cliff
    #sub Go {dir|315}
➞ {enter|2_9_6} #The Boiling Lake
Find and Kill {kill|The Basilisk}, take {quest_text|Basilisk Acid}
    #sub Go {dir|45} look for petrified soldiers
Get {crafting}
{logout}
Talk to {generic|Sin}
Hand in {quest|a9q3}
Hand in {quest|a9q5|a9q5_offer}, take {quest_text|Bottled Storm}
{waypoint|2_9_3} #The Vastiri Desert
➞ {enter|2_9_4} #The Oasis
    #sub Go {dir|45}
➞ {arena|The Sand Pit}, kill {kill|Shakari, Queen of the Sands}
{logout}
Hand in {quest|a9q5|a9q5} #Queen of the Sands
{waypoint|2_9_5} #The Foothills
➞ {enter|2_9_7} #The Tunnel
    #sub Go {dir|315}
#ifdef LEAGUE_START
    Before {waypoint}, complete {trial}
    Get {crafting}
#endif
➞ {enter|2_9_8} #The Quarry
Get {waypoint_get}
    #sub Go {dir|315}
Get {crafting}
➞ {arena|Shrine of the Winds}, kill {kill|Garukhan, Queen of the Winds}, take {quest_text|Sekhema Feather}
    #sub {dir|45} or {dir|225}
{logout}
Hand in {quest|a9q2} #The Ruler of Highgate
{waypoint|2_9_8} #The Quarry
➞ {enter|2_9_9} #The Refinery
    #sub {dir|315} or {dir|45}
Find and kill {kill|General Adus}, take {quest_text|Trarthan Powder}
    #sub Go {dir|45} follow cart tracks
{logout}
{waypoint|2_9_8} #The Quarry
Talk to {generic|Sin}
➞ {enter|2_9_10_1} #The Belly of the Beast
➞ {enter|2_9_10_2} #The Rotting Core
➞ {arena|The Black Core}
Talk to {generic|Sin}
➞ {arena|Doedre's Despair}, kill {kill|Doedre, Darksoul}
➞ {arena|Maligaro's Misery}, kill {kill|Maligaro, The Broken}
➞ {arena|Shavronne's Sorrow}, kill {kill|Shavronne, Unbound}
Talk to {generic|Sin} ➞ {arena|The Black Heart}, kill {kill|The Depraved Trinity}
{portal|use}
`;export{e as default};
