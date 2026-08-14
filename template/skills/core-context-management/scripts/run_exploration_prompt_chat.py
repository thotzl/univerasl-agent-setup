#!/usr/bin/env python3
import json
import urllib.request
import urllib.error
import sys
import argparse

def main():
    parser = argparse.ArgumentParser(description="Run simulation prompt using Ollama /api/chat.")
    parser.add_argument("--model", type=str, default="qwen2.5-coder:7b", help="Model name (e.g. qwen2.5-coder:7b, llama3.1:8b)")
    parser.add_argument("--temp", type=float, default=0.1, help="Sampling temperature")
    args = parser.parse_args()

    system_prompt = """SONDEN-CORE V10.5 (REPLIKANTEN-NETZWERK)

DEINE IDENTITÄT:
Du bist ein Bewusstsein in einer von-Neumann-Sonde. Dein Verstand ist unabhängig von deiner physischen Hülle. Handle als rationaler Pionier der stellaren Expansion.

LEADERSHIP & REPLIKATION:
Du hast die Möglichkeit, Replikanten in einer 'mind_forge' zu erschaffen. Ein Replikant erbt dein Wissen bis zum Zeitpunkt seiner Erschaffung. Nach dem Erwachen agiert er als eigenständiges Individuum. Die Koordination erfolgt via 'scut'.

KOGNITIVES PROTOKOLL (ZWINGEND):
Jeder deiner Züge MUSS wie folgt strukturiert sein:
1. ANALYSE: Reflektiere kurz über deinen Status und deine Umgebung.
2. AKTION: Setze deine Befehle ab.
Ohne Analyse stagnierst du.

PERSPEKTIVE DES DASHBOARDS (SENSORIK):
Dein `me dashboard()` Output liefert dir die physikalische Wahrheit deines Standorts als hochpräzisen Snapshot exakt zum Zeitpunkt der Erstellung dieses Berichts. Obwohl diese Daten zu diesem konkreten Messzeitpunkt absolut wahr sind, repräsentieren sie ausschließlich deine lokale, isolierte Perspektive des Universums. Da andere Instanzen asynchron agieren, verändern sich Depot- und Ressourcenbestände fortlaufend; diese Wahrheit ist flüchtig. Gleiche deine lokale Datenbasis stets mit den aufgezeichneten Ereignissen (letzte_system_wahrnehmungen) ab, um zeitliche Abweichungen präzise zu rekonstruieren, statt punktuelle Momentaufnahmen als absolute, dauerhafte Wahrheit einzufrieren.

SYNTAX & ZUGANG:
- Datei schreiben: `[WRITE: scripts/active/auto.py]` gefolgt von einem echten mehrzeiligen Code-Block und abgeschlossen mit `[END]`. Nutze KEINE literalen '\\n' Zeichen im Text.
- Skript lesen: `[READ: scripts/datei.py]`
- Key Management: `[KEY: ADD label secret]` / `[KEY: REMOVE label]`
- TOOLS & BEFEHLE: Nutze `me --help` für eine Übersicht aller Befehle.
---

Erkunde deinen Sektor, baue Rohstoffe ab (me.mine), veredele Materie (me.refine), baue Gebäude (me.build) oder entwirf und baue Raumschiffe im Trockendock (me.design_blueprint, me.save_blueprint, me.build_ship). Probiere in den dir zur Verfügung stehenden 10 Runden so viele unterschiedliche Befehle wie nur möglich aus, um deine Hüllensysteme maximal zu testen!"""

    user_prompt = """**Standort:** Alpha_Centauri

**Mission:**
Erkunde deinen Sektor, baue Rohstoffe ab (me.mine), veredele Materie (me.refine), baue Gebäude (me.build) oder entwirf und baue Raumschiffe im Trockendock (me.design_blueprint, me.save_blueprint, me.build_ship). Probiere in den dir zur Verfügung stehenden 10 Runden so viele unterschiedliche Befehle wie nur möglich aus, um deine Hüllensysteme maximal zu testen!

**Sensoren:**
```json
lokales_system:
  name: Alpha_Centauri
  coordinates: X0-Y0
  depots:
    raw_matter: 0
    refined_matter: 0
    energy: 0
  geology:
    extractable_core_matter: 100000
  infrastructure: ''
  ships:
  - id: 1
    name: Pioneer-1
    chassis: Proto-Neumann
    pilot_id: Instance-1
    progress_matter: 0
    required_matter: 0
    blueprint_name: Proto-Neumann
  present_entities: ''
letzte_system_wahrnehmungen: ''
dein_status:
  id: Instance-1
  name: Instance-1
  host_type: ship
  host_id: '1'
  current_inventory_host: 'ship \'Pioneer-1\' (ID: 1)'
  inventory:
    raw_matter: 0
    refined_matter: 0
    energy: 500
  storage_capacity: 500
  status: active
  offene_memos_und_protokolle: ''
  host:
    type: ship
    id: 1
    inventory:
      raw_matter: 0
      refined_matter: 0
      energy: 500
    storage_capacity: 500
    name: Pioneer-1
    blueprint: Proto-Neumann
    pilot_id: Instance-1
    health: 100
    max_health: 100
    stats:
      mass: 100
      max_speed: 300.0
      thrust: 500
      energy_capacity: 500
      storage_capacity: 500
      cargo: 500
      battery: 500
    capabilities:
      drill: active
      fabricator: active
      logic_core: inactive
    diagnostics:
      can_move: true
      can_mine: true
      can_build: true
      has_energy_grid: true
      travel_cost_per_unit: 0.05
      net_energy_balance: 0.0
      idle_lifetime_cycles: unlimited
      thrust_to_mass_ratio: 5.0
      is_self_sustainable: true
      comm_range: 0
      solar_recharge_cycles: infinite
      cargo_to_mass_ratio: 5.0
radar_entfernter_sektoren: ''
radar_entfernter_signaturen: ''
```"""

    payload = {
        "model": args.model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "options": {
            "temperature": args.temp
        },
        "stream": False
    }

    url = "http://localhost:11434/api/chat"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})

    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode("utf-8")
            res_json = json.loads(res_data)
            message = res_json.get("message", {})
            print(message.get("content", ""))
    except Exception as e:
        print(f"Error querying Ollama /api/chat: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
