# Backup of Removed Duplicate Sections

This document preserves the exact text, lore, structure definitions, and metadata from sections removed during Step 2 refactoring to avoid content duplication.

---

## 1. Section (a): Older "Four Realms" Detail Panel
**Original File:** `src/App.jsx` (Lines 1763–1973)  
**Original Section ID:** `#four-realms`  
**Duplicated By:** Modern Ocean Section (`#four-realms-ocean`)

### Editorial Header
- **Pill Tag:** `✦ THE FLOATING ARCHIPELAGO ✦`
- **Headline:** `The Four Sovereign Realms`
- **Prose:**
  > "Suspended above the endless cloud ocean lies the World Map—a constellation of four floating islands charting the foundational advances of human life. At the heart of the archipelago stands Agriculture, anchoring the player journey across the skies."

### Primary Visual Centerpiece
- **Image:** `/images/world-map.jpg`
- **Alt:** "MERGEVERSE In-Game World Map showing Agriculture, Food & Culinary, Healthcare & Medicine, and Assistive Technology floating islands"
- **Interactive Pins:** 4 hotspot beacon coordinates on the map image corresponding to the 4 realms.

### Featured Realm Spotlight: Realm 01 · Agriculture
- **Tag:** `SOVEREIGN DOMAIN 01 · FOUNDATIONAL CULTIVATION`
- **Headline:** `AGRICULTURE`
- **Sub-headline:** `Nurturing the Earth & The Dawn of Settlement`
- **Status:** `Active Hub · Level 20 Unlocked`
- **Summary:**
  > "The foundational realm of cultivation and harvest. Guided by terraced crop furrows, timber barns, and rustic windmills, explorers master the ancient crafts of the earth to nourish thriving settlements."
- **Key Architectural Features:**
  - Two-story red timber barn & towering grain silo
  - Rustic wooden windmill with timber sail rotors
  - Terraced crop furrows & irrigation bridge
  - Cliffside freshwater waterfall cascade into sea

### Supporting Domain Drawer (Locked Realms)
1. **Realm 02: Food & Culinary**
   - **Tag:** `Milestone Locked · Crafting Hub`
   - **Headline:** `Crafting Nutrition, Fermentation & Gastronomy`
   - **Description:** "The craft of sustenance and community. Centered around bustling cobblestone piazzas, artisanal bakehouses, and market stalls, explorers harness thermal heat and fermentation to feed expanding societies."
   - **Key Structures:**
     - Alpine stone tavern & cobblestone piazza
     - Sunlit market bazaar awnings & produce stalls
     - Carved stone freshwater spring fountain
     - Timber trading pier extending into open waters
2. **Realm 03: Healthcare & Medicine**
   - **Tag:** `Milestone Locked · Botanical Sanctuary`
   - **Headline:** `Apothecary Science, Clinical Care & Vitality`
   - **Description:** "The discipline of preservation and healing. Set amid serene mountain terrace pavilions, mineral spring aqueducts, and verdant apothecary gardens, explorers extract curative essences to advance clinical diagnostics."
   - **Key Structures:**
     - Classical clinical sanctuary pavilion & triage archway
     - Terraced apothecary herb gardens & glass conservatories
     - Steaming alpine thermal bath & mineral aqueduct
     - High mountain rescue hospice overlooking the clouds
3. **Realm 04: Assistive Technology**
   - **Tag:** `Milestone Locked · Engineering Citadel`
   - **Headline:** `Adaptive Mechanics, Mobility & Universal Design`
   - **Description:** "The zenith of inclusive innovation. Built across terraced engineering platforms, gentle stone switchback ramps, and hydro-powered workshops, explorers construct adaptive mechanisms that empower all people."
   - **Key Structures:**
     - Hydro-powered forge workshop with massive timber waterwheel
     - Gentle switchback incline ramp & step-free terrace walkways
     - Timber guildhall with double-wide archways & tactile pathways
     - Cable-winch cargo lift tower bridging mountain elevations

---

## 2. Section (b): Older "The Complete In-Engine Experience" Gallery
**Original File:** `src/BehindTheWorlds.jsx` (Lines 362–518)  
**Original Section:** Chapter 04 · The Result  
**Duplicated By:** Modern Overlapping Gameplay Cards (`#gameplay-progression-showcase`)

### Chapter Header
- **Pill Tag:** `✦ CHAPTER 04 · THE RESULT ✦`
- **Headline:** `The Complete In-Engine Experience`
- **Sub-headline:** `Four verified in-game screenshots illustrating the playable reality of MERGEVERSE.`

### 4 Gallery Cards
1. **01 · Archipelago Cartography: The Four Sovereign Sky Realms**
   - **Image:** `/images/world-map.jpg`
   - **Alt:** "MERGEVERSE In-Game World Map with four floating islands"
   - **Caption:** "Active Agriculture hub alongside locked Food & Culinary, Healthcare & Medicine, and Assistive Technology floating archipelagos."
   - **Action:** Inspect Map modal trigger
2. **02 · Expedition Basecamp: The Alpine Sanctuary**
   - **Image:** `/images/home-dashboard.jpg`
   - **Alt:** "MERGEVERSE Home Dashboard screenshot"
   - **Caption:** "Explorer Level 6 standing (1,395 / 1,400 XP), achievements, and persistent telemetry."
   - **Action:** Inspect Basecamp modal trigger
3. **03 · Puzzle Board: Level 19 Harvest Board**
   - **Image:** `/images/gameplay.jpg`
   - **Alt:** "MERGEVERSE Level 19 gameplay board"
   - **Caption:** "5×6 cascade merge board fulfilling artisanal bread recipes with double merge bonuses."
   - **Action:** Inspect Gameplay modal trigger
4. **04 · Pedagogical Design: In-Game Knowledge Challenge**
   - **Image:** `/images/knowledge-challenge.png`
   - **Alt:** "MERGEVERSE In-Game Knowledge Challenge screenshot"
   - **Caption:** "Milestone challenges testing real historical facts before awarding three-star level completion."
   - **Action:** Inspect Knowledge Challenge modal trigger
