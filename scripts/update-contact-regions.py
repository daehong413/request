#!/usr/bin/env python3
"""Import the official code.go.kr legal-area ZIP, preserving existing URLs."""

import argparse
from collections import Counter
from datetime import date
import hashlib
import json
from pathlib import Path
import re
import zipfile

ROOT_NAMES = {
    "서울특별시": "서울", "부산광역시": "부산", "대구광역시": "대구",
    "인천광역시": "인천", "광주광역시": "광주", "대전광역시": "대전",
    "울산광역시": "울산", "세종특별자치시": "세종", "경기도": "경기",
    "강원특별자치도": "강원", "충청북도": "충북", "충청남도": "충남",
    "전북특별자치도": "전북", "전라남도": "전남", "경상북도": "경북",
    "경상남도": "경남", "제주특별자치도": "제주",
    "전남광주통합특별시": "전남광주",
}

# Explicit URL choices take precedence over previously imported shorthand.
URL_OVERRIDES = {
    "2600000000": {"slug": "부산", "name": "부산"},
    "4137010200": {"slug": "부산동", "name": "부산동"},
}


def short_name(name):
    if name in ROOT_NAMES:
        return ROOT_NAMES[name]
    short = re.sub(r"[시군구읍면]$", "", name)
    return short if len(short) >= 2 else name


def slug_candidate(full_name, depth):
    parts = full_name.split()
    if depth == 2 and len(parts) >= 2 and short_name(parts[-2]) == short_name(parts[-1]):
        return parts[-1]  # 제주특별자치도 제주시 → 제주시, not 제주제주
    return "".join(short_name(part) for part in parts[-depth:])


def import_regions(archive, previous, migrate_dong=False):
    with zipfile.ZipFile(archive) as source:
        files = [name for name in source.namelist() if name.lower().endswith(".txt")]
        if len(files) != 1:
            raise ValueError("Expected one legal-area text file in the official ZIP")
        text = source.read(files[0]).decode("cp949")
    if text.splitlines()[0].strip() != "법정동코드\t법정동명\t폐지여부":
        raise ValueError("Unexpected official data header")

    entries = []
    for line in text.splitlines()[1:]:
        if not line.strip():
            continue
        code, full_name, status = (part.strip() for part in line.split("\t"))
        if not re.fullmatch(r"\d{10}", code):
            raise ValueError(f"Invalid code: {code}")
        # Last two digits are ri codes; administrative dong are not in this source.
        if status != "존재" or not code.endswith("00"):
            continue
        full_name = " ".join(full_name.split())
        parts = full_name.split()
        leaf = parts[-1]
        if len(parts) == 1:
            level = "도" if leaf.endswith("도") else "시"
        elif code[5:] == "00000":
            level = leaf[-1]
        else:
            level = leaf[-1] if leaf.endswith(("읍", "면")) else "동"
        if level not in {"도", "시", "군", "구", "읍", "면", "동"}:
            raise ValueError(f"Unknown area level: {full_name}")
        entries.append({"code": code, "name": short_name(leaf),
                        "fullName": full_name, "level": level})

    by_code = {entry["code"]: entry for entry in entries}
    by_name = {entry["fullName"]: entry for entry in entries}
    if len(by_code) != len(entries) or len(by_name) != len(entries):
        raise ValueError("Duplicate official code or full name")
    old = {entry["code"]: entry for entry in previous}
    retired = sorted(set(old) - set(by_code))
    if retired:
        raise ValueError(f"Review retired codes and redirects before import: {retired}")

    used = set()
    old_by_slug = {entry["slug"]: entry for entry in previous}
    major_names = Counter(entry["name"] for entry in entries if entry["level"] in {"시", "도", "군", "구"})
    for entry in entries:
        saved = URL_OVERRIDES.get(entry["code"]) or old.get(entry["code"])
        if migrate_dong and entry["level"] == "동":
            saved = URL_OVERRIDES.get(entry["code"])
        owner = old_by_slug.get(entry["name"])
        if (migrate_dong and entry["level"] in {"시", "도", "군", "구"}
                and major_names[entry["name"]] == 1 and owner and owner["level"] == "동"):
            saved = {"slug": entry["name"], "name": entry["name"]}
        if saved:
            entry["slug"] = saved["slug"]
            entry["name"] = saved["name"]
            if entry["slug"] in used:
                raise ValueError("Duplicate preserved URL")
            used.add(entry["slug"])

    # Allocate roots first, then resolve peers together so source row order cannot
    # give one of two identically named districts an ambiguous short URL.
    for roots_only in (True, False):
        pending = [entry for entry in entries if "slug" not in entry
                   and (len(entry["fullName"].split()) == 1) == roots_only]
        for depth in range(1, 6):
            candidates = {
                entry["code"]: slug_candidate(entry["fullName"], depth)
                for entry in pending
            }
            counts = Counter(candidates.values())
            remaining = []
            for entry in pending:
                candidate = candidates[entry["code"]]
                if candidate not in used and counts[candidate] == 1:
                    entry["slug"] = candidate
                    used.add(candidate)
                else:
                    remaining.append(entry)
            pending = remaining
        for entry in pending:
            # Different legal suffixes can collapse to the same shorthand.
            candidate = "".join(entry["fullName"].split())
            if candidate in used:
                candidate += "-" + entry["code"]
            entry["slug"] = candidate
            used.add(candidate)

    result = []
    for entry in sorted(entries, key=lambda item: item["code"]):
        row = {key: entry[key] for key in ("code", "slug", "name", "fullName", "level")}
        if " " in entry["fullName"]:
            parent_name = entry["fullName"].rsplit(" ", 1)[0]
            if parent_name not in by_name:
                raise ValueError(f"Missing parent: {parent_name}")
            row["parentSlug"] = by_name[parent_name]["slug"]
        result.append(row)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path, help="Official legal-area ZIP (CP949)")
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1] / "lib/data/contact-regions.json")
    parser.add_argument("--retrieved-at", default=date.today().isoformat())
    parser.add_argument("--migrate-dong-slugs", action="store_true", help="Keep legal dong names and prioritize major-area shorthand")
    args = parser.parse_args()
    date.fromisoformat(args.retrieved_at)
    existing = json.loads(args.output.read_text()) if args.output.exists() else {}
    previous = existing.get("regions", [])
    regions = import_regions(args.archive, previous, args.migrate_dong_slugs)
    by_code = {entry["code"]: entry for entry in regions}
    active_slugs = {entry["slug"] for entry in regions}
    legacy = {entry["slug"]: entry["code"] for entry in existing.get("legacySlugs", [])}
    for entry in previous:
        if entry["slug"] != by_code[entry["code"]]["slug"]:
            legacy[entry["slug"]] = entry["code"]
    # A URL intentionally reassigned to another active area must not redirect.
    aliases = [{"slug": slug, "code": code} for slug, code in sorted(legacy.items())
               if slug not in active_slugs and code in by_code]
    data = {
        "source": "https://www.code.go.kr/stdcode/regCodeL.do",
        "retrievedAt": args.retrieved_at,
        "sourceSha256": hashlib.sha256(args.archive.read_bytes()).hexdigest(),
        "scope": "현존 전국 법정구역, 시·도·시·군·구·읍·면·동 포함, 리 및 행정동 제외",
        "regions": regions,
        "legacySlugs": aliases,
    }
    args.output.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    by_code = {entry["code"]: entry for entry in regions}
    preserved = sum(by_code[entry["code"]]["slug"] == entry["slug"] for entry in previous)
    print(f"Imported {len(regions):,} areas; preserved {preserved:,} existing URLs")


if __name__ == "__main__":
    main()
