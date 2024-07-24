const e=`#section Act 6
➞ {enter|2_6_town} #Lioneye's Watch
➞ {enter|2_6_1} #The Twilight Strand
Kill {kill|Everything}
{logout}
Hand in {quest|a6q4} #Fallen from Grace
➞ {enter|2_6_2} #The Coast
➞ {enter|2_6_4} #The Mud Flats
Find and kill {kill|The Dishonoured Queen}, take {quest_text|Eye of Conquest}
    #sub {dir|45} corner of area, normally by a house
➞ {enter|2_6_5} #The Karui Fortress
➞ {arena|Tukohama's Keep}, kill {kill|Tukohama, Karui God of War}
Get {crafting}
➞ {enter|2_6_6} #The Ridge
    #sub Go {dir|0}
➞ {enter|2_6_7_1} #The Lower Prison
#ifdef LEAGUE_START
    Complete {trial}
#endif
Get {crafting}
➞ {enter|2_6_7_2} #Shavronne's Tower
➞ {arena|Prison Rooftop}, kill {kill|Shavronne the Returned} & {kill|Reassembled Brutus}
➞ {arena|The Warden's Chambers}
Get {crafting}
➞ {enter|2_6_8} #Prisoner's Gate
➞ {enter|2_6_9} #The Western Forest
    #sub Follow the road
Get {crafting}
➞ {enter|2_6_10} #The Riverways
    #sub Follow the road
Get {waypoint_get}
    #sub Follow the road
➞ {enter|2_6_11} #The Wetlands
    #sub Look for 2 pillars near {waypoint}, follow the trail
➞ {arena|The Spawning Ground}, kill {kill|Ryslatha, the Puppet Mistress}
    #sub Go {dir|315}
{logout}
Hand in {quest|a6q3} #The Father of War
Hand in {quest|a6q2} #Essence of Umbra
Hand in {quest|a6q6} #The Puppet Mistress
{waypoint|2_6_10} #The Riverways
➞ {enter|2_6_12} #The Southern Forest
    #sub Follow the road until it ends
    #sub Go {dir|135}
➞ {enter|2_6_13} #The Cavern of Anger
Take {quest_text|The Black Flag}
➞ {enter|2_6_14} #The Beacon
Get {crafting}
    #sub Follow the shore
Complete {quest_text|Pillar Push}
Light the {quest_text|Beacon}, throw in {quest_text|The Black Flag}
Talk to {generic|Weylam Roth}, sail to {enter|2_6_15} #The Brine King's Reef
➞ {arena|The Bring King's Throne}, kill {kill|Tsoagoth, The Brine King}
{logout}
Select {generic|Pantheons}
`;export{e as default};
