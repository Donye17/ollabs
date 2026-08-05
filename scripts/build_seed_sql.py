#!/usr/bin/env python3
"""
Build the SQL that seeds the Aug-Oct 2026 campaign set.

Every row is a real, usable campaign with 0 supporters and 0 views. No fake
social proof. Idempotent via ON CONFLICT (slug) DO NOTHING, so it is safe to
re-run after adding new entries.

Usage:  python3 scripts/build_seed_sql.py > drizzle/seed_q3_2026_campaigns.sql
"""

import json

BLURB = ("Free, no signup, no ads, and never a watermark on your supporters' "
         "photos. Add it to your profile picture in seconds with Ollabs.")


def cfg(frame_file):
    return {
        "type": "CUSTOM_IMAGE",
        "color1": "transparent",
        "width": 0,
        "imageUrl": f"/frames/{frame_file}.png",
        "cutoutScale": 0,
        "id": frame_file,
        "name": frame_file.replace("-", " ").title(),
    }


# slug, title, frame file, category, lede
CAMPAIGNS = [
    # ---- October: Breast Cancer Awareness Month (largest single moment)
    ("breast-cancer-awareness-ribbon", "Breast Cancer Awareness Ribbon Frame",
     "breast-cancer-ribbon", "awareness",
     "Wear the pink ribbon for Breast Cancer Awareness Month."),
    ("breast-cancer-in-this-together", "Breast Cancer: In This Together Frame",
     "breast-cancer-badge", "awareness",
     "Show your team, your survivors, and your supporters that they are not alone."),
    ("breast-cancer-subtle", "Breast Cancer Awareness (Subtle) Frame",
     "breast-cancer-minimal", "awareness",
     "A quieter pink ring for people who want to show support without a loud graphic."),

    # ---- October: Domestic Violence Awareness Month
    ("domestic-violence-awareness", "Domestic Violence Awareness Ribbon Frame",
     "domestic-violence-ribbon", "awareness",
     "Wear the purple ribbon for Domestic Violence Awareness Month."),
    ("no-more-domestic-violence", "No More Frame",
     "domestic-violence-badge", "awareness",
     "A clear stand against domestic violence for your organisation and your staff."),

    # ---- October: Unity Day / bullying prevention (PACER orange, 3rd Wed of Oct)
    ("unity-day-2026", "Unity Day 2026 Frame",
     "unity-day-badge", "school",
     "Go orange for Unity Day and stand together against bullying."),
    ("kindness-wins", "Kindness Wins Frame",
     "unity-day-arc", "school",
     "For schools and classrooms running anti-bullying and kindness campaigns."),

    # ---- October: World Mental Health Day (Oct 10)
    ("world-mental-health-day", "World Mental Health Day Frame",
     "mental-health-arc", "awareness",
     "Mark World Mental Health Day and let people know they matter."),
    ("mental-health-subtle", "Mental Health Awareness (Subtle) Frame",
     "mental-health-minimal", "awareness",
     "A quiet teal ring for year-round mental health support."),

    # ---- September: Suicide Prevention Awareness Month
    ("suicide-prevention-ribbon", "Suicide Prevention Ribbon Frame",
     "suicide-prevention-ribbon", "awareness",
     "Wear the teal and purple ribbon for Suicide Prevention Awareness Month."),
    ("988-lifeline", "988 Lifeline Frame",
     "suicide-prevention-badge", "awareness",
     "Put the 988 Suicide and Crisis Lifeline number where people will see it."),

    # ---- September: Childhood Cancer Awareness Month
    ("childhood-cancer-ribbon", "Childhood Cancer Gold Ribbon Frame",
     "childhood-cancer-ribbon", "awareness",
     "Wear the gold ribbon for Childhood Cancer Awareness Month."),
    ("go-gold-childhood-cancer", "Go Gold Frame",
     "childhood-cancer-badge", "awareness",
     "Go Gold in September for the kids and families fighting childhood cancer."),

    # ---- September: Hispanic Heritage Month (Sep 15 - Oct 15)
    ("hispanic-heritage-month", "Hispanic Heritage Month Frame",
     "hispanic-heritage-arc", "community",
     "Celebrate Hispanic Heritage Month with your community."),

    # ---- September: World Alzheimer's Month
    ("alzheimers-awareness-ribbon", "Alzheimer's Awareness Ribbon Frame",
     "alzheimers-ribbon", "awareness",
     "Wear the purple ribbon for World Alzheimer's Month."),

    # ---- August/September: schools and teams
    ("homecoming-2026", "Homecoming 2026 Frame",
     "homecoming-arc", "school",
     "Rally students and alumni behind homecoming week."),
    ("class-of-2027", "Class of 2027 Frame",
     "class-of-2027-badge", "school",
     "For the incoming senior class and everyone cheering them on."),
    ("game-day", "Game Day Frame",
     "go-team-badge", "sports",
     "Get the whole roster, the parents, and the boosters matching on game day."),

    # ---- August: National Nonprofit Day (Aug 17)
    ("national-nonprofit-day", "National Nonprofit Day Frame",
     "nonprofit-day-badge", "cause",
     "Celebrate the people who keep nonprofits running."),

    # ---- Q4: Giving Tuesday (Dec 1 2026). Seeded early so it ranks in time.
    ("giving-tuesday-2026", "Giving Tuesday 2026 Frame",
     "giving-tuesday-arc", "cause",
     "Rally your donors for Giving Tuesday on December 1, 2026."),
    ("i-gave-giving-tuesday", "I Gave Frame",
     "giving-tuesday-badge", "cause",
     "Let your donors show they gave, and pull their friends in behind them."),

    # ---- Evergreen organisational set
    ("volunteer", "Volunteer Frame",
     "volunteer-badge", "cause",
     "Recognise your volunteers and make it easy for them to show it."),
    ("blood-donor", "Blood Donor Frame",
     "donor-badge", "cause",
     "For blood drives, donor recognition, and recruitment pushes."),
    ("supporter", "Supporter Frame",
     "supporter-minimal", "community",
     "A clean, unbranded ring any organisation can point its supporters at."),
]


def esc(s):
    return s.replace("'", "''")


def main():
    print("-- Aug-Oct 2026 campaign set, plus Giving Tuesday seeded early for SEO.")
    print("-- Uses designed CUSTOM_IMAGE frames from public/frames (see scripts/generate_frames.py).")
    print("-- Real campaigns, 0 supporters, 0 views. No fake social proof.")
    print("-- Idempotent: ON CONFLICT (slug) DO NOTHING.\n")
    for slug, title, frame, cat, lede in CAMPAIGNS:
        desc = f"{lede} {BLURB}"
        j = json.dumps(cfg(frame), separators=(", ", ": "))
        print(
            "INSERT INTO campaigns (slug, title, description, frame_config, creator_name, "
            "is_public, category, supporter_count, view_count, created_at) VALUES ("
            f"'{esc(slug)}', '{esc(title)}', '{esc(desc)}', '{esc(j)}'::jsonb, "
            f"'Ollabs', true, '{cat}', 0, 0, NOW()) ON CONFLICT (slug) DO NOTHING;"
        )
    print(f"\n-- {len(CAMPAIGNS)} campaigns")


if __name__ == "__main__":
    main()
