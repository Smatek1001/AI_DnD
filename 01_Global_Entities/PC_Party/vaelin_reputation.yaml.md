---
name: "Vaelin's Reputation & Network"
type: character_network
character_ref: "[[Vaelin_Shadowleaf]]"
tags: [factions, mechanics, reputation]
last_session: 0
last_updated: "2026-04-21T22:09:13-05:00"
---

```yaml
factions:
  # Scale: Hostile, Unfriendly, Neutral, Friendly, Allied (or a numeric system if you prefer)
  The Society:
    standing: "Allied (Graduated Member)"
    notes: "Vaelin is a recognized operative. Granted access to lower-tier safehouses."
  The Cult:
    standing: "Hostile"
    notes: "Servants of The Nameless One"
  The Ratlings:
    standing: "Allied"

safehouse_network_handlers:
  - name: "[[Silas the Rat]]"
    location: "[[The Leaky Cauldron]]"
    status: "Active"
    notes: "Primary dead-drop contact. Will provide a secure room, but will not provide weapons or backup."

key_npc_relationships:
  - name: "[[Lirael]]"
    disposition: "Loyal (Secretly reporting to Caladwen)"
    notes: "Currently annoying Vaelin by leaving shiny buttons in his boots."
  - name: Finch
    disposition: "Ally"
    notes: "Leader of The Ratlings"
```
