"""Regression checks for nationwide coverage and stable legal-area URLs."""

import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("regions_import", ROOT / "scripts/update-contact-regions.py")
IMPORTER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(IMPORTER)


class ContactRegionsTest(unittest.TestCase):
    def test_published_data_hierarchy(self):
        regions = json.loads((ROOT / "lib/data/contact-regions.json").read_text())["regions"]
        by_slug = {row["slug"]: row for row in regions}
        self.assertEqual(len(regions), len(by_slug))
        self.assertEqual(len(regions), len({row["code"] for row in regions}))
        for row in regions:
            self.assertTrue(row["code"].endswith("00"))
            if "parentSlug" in row:
                parent = by_slug[row["parentSlug"]]
                self.assertEqual(parent["fullName"], row["fullName"].rsplit(" ", 1)[0])
            else:
                self.assertNotIn(" ", row["fullName"])
        for slug in ["서울", "경기", "인천", "부산", "대구", "대전", "울산", "세종",
                     "충북", "충남", "경북", "경남", "강원", "전북", "전남광주", "제주"]:
            self.assertNotIn("parentSlug", by_slug[slug])
        for slug in ["수원", "영통", "망포동"]:
            self.assertIn(slug, by_slug)
        self.assertEqual(by_slug["부산"]["fullName"], "부산광역시")
        self.assertEqual(by_slug["부산동"]["fullName"], "경기도 오산시 부산동")
        self.assertEqual(by_slug["부산동"]["name"], "부산동")
        self.assertEqual(by_slug["제주시"]["fullName"], "제주특별자치도 제주시")
        for row in regions:
            if row["level"] == "동":
                self.assertEqual(row["name"], row["fullName"].split()[-1])
                self.assertTrue(row["slug"].endswith(row["name"]))
        legacy = json.loads((ROOT / "lib/data/contact-regions.json").read_text())["legacySlugs"]
        self.assertFalse({row["slug"] for row in legacy} & set(by_slug))
        self.assertEqual(len(legacy), len({row["slug"] for row in legacy}))
        for row in legacy:
            self.assertIn(row["code"], {r["code"] for r in regions})

    def test_official_parser_and_stable_urls(self):
        # Includes special-city hierarchy, whitespace, same names, abolished
        # records and ri records. None should silently corrupt the URL tree.
        rows = [
            ("5100000000", "강원특별자치도", "존재"),
            ("5182000000", "강원특별자치도 고성군 ", "존재"),
            ("5182025000", "강원특별자치도 고성군 간성읍", "존재"),
            ("5182025021", "강원특별자치도 고성군 간성읍 하리", "존재"),
            ("4800000000", "경상남도", "존재"),
            ("4882000000", "경상남도 고성군", "존재"),
            ("3611000000", "세종특별자치시", "존재"),
            ("3611010700", "세종특별자치시 나성동", "존재"),
            ("4200000000", "강원도", "폐지"),
        ]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "source.zip"
            def write(items):
                text = "법정동코드\t법정동명\t폐지여부\n" + "\n".join("\t".join(row) for row in items)
                with zipfile.ZipFile(path, "w") as archive:
                    archive.writestr("regions.txt", text.encode("cp949"))
            write(rows)
            first = IMPORTER.import_regions(path, [])
            slugs = {row["slug"] for row in first}
            self.assertEqual(len(first), 7)
            self.assertTrue({"강원고성", "경남고성"} <= slugs)
            sejong_child = next(row for row in first if row["name"] == "나성동")
            self.assertEqual(sejong_child["parentSlug"], "세종")
            write(list(reversed(rows)))
            self.assertEqual(first, IMPORTER.import_regions(path, []))
            first[0]["slug"] = "기존주소"
            updated = IMPORTER.import_regions(path, first)
            self.assertEqual({r["code"]: r["slug"] for r in first},
                             {r["code"]: r["slug"] for r in updated})
            write(rows[:-1] + [("9900000000", "테스트도", "존재")])
            with self.assertRaises(ValueError):
                IMPORTER.import_regions(path, [{"code": "4200000000", "slug": "옛강원", "name": "강원"}])


if __name__ == "__main__":
    unittest.main()
