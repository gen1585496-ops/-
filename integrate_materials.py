#!/usr/bin/env python3
"""
Learning materials integration script.
Syncs learning_materials.json into knowledge_base.json with spaced repetition.
"""

import json
from datetime import datetime, timedelta
from pathlib import Path

KB_PATH = Path("/home/user/-/knowledge_base.json")
LM_PATH = Path("/home/user/-/learning_materials.json")

def load_json(path):
    """Load JSON file."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(path, data):
    """Save JSON file."""
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def generate_review_schedule(added_date_str, intervals=[1, 3, 7, 14, 30]):
    """Generate spaced repetition schedule."""
    added_date = datetime.strptime(added_date_str, "%Y-%m-%d")
    schedule = []
    for i, interval in enumerate(intervals, 1):
        due_date = added_date + timedelta(days=interval)
        schedule.append({
            "review_number": i,
            "due_date": due_date.strftime("%Y-%m-%d"),
            "completed": False
        })
    return schedule

def integrate_materials():
    """Integrate new materials from learning_materials.json into knowledge_base.json"""
    kb = load_json(KB_PATH)
    lm = load_json(LM_PATH)

    existing_ids = {topic["id"] for topic in kb["topics"]}
    new_topics = []

    for material in lm["materials"]:
        if material.get("integrated"):
            continue  # Skip already integrated

        if material["id"] in existing_ids:
            print(f"⏭️  Skipped (already exists): {material['id']}")
            continue

        # Build new topic
        topic = {
            "id": material["id"],
            "title": material["title"],
            "summary": f"{material.get('user_note', '')} | {material['title']}".strip(),
            "quiz_questions": material.get("quiz_questions", []),
            "added_date": material["date_completed"],
            "review_schedule": generate_review_schedule(material["date_completed"]),
            "source": material.get("source", ""),
            "material_type": material.get("type", "")
        }

        kb["topics"].append(topic)
        new_topics.append(material["id"])
        print(f"✅ Integrated: {material['id']}")

    # Mark as integrated
    for material in lm["materials"]:
        if material["id"] in new_topics:
            material["integrated"] = True

    # Save files
    if new_topics:
        save_json(KB_PATH, kb)
        save_json(LM_PATH, lm)
        print(f"\n✨ {len(new_topics)} new topic(s) added to knowledge_base.json")
    else:
        print("\nℹ️  No new materials to integrate")

if __name__ == "__main__":
    integrate_materials()
