"""Backend API tests for Laboratory for Multiscale Innovative Technologies."""
import os
import re
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load frontend .env to get REACT_APP_BACKEND_URL (public URL)
load_dotenv(Path(__file__).resolve().parents[2] / "frontend" / ".env")

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API = f"{BASE_URL}/api"

TIMEOUT = 30


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ============ Health / Root ============
class TestRoot:
    def test_root(self, session):
        r = session.get(f"{API}/", timeout=TIMEOUT)
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "running"
        assert "Laboratory" in data.get("message", "")


# ============ /api/lab-info ============
class TestLabInfo:
    def test_lab_info_structure(self, session):
        r = session.get(f"{API}/lab-info", timeout=TIMEOUT)
        assert r.status_code == 200, r.text
        data = r.json()
        # Required fields
        for f in ["name", "tagline", "description", "email", "phone", "address"]:
            assert f in data, f"Missing field {f}"
            assert isinstance(data[f], str) and data[f].strip(), f"Empty {f}"
        # _id should be excluded
        assert "_id" not in data
        # Sanity
        assert "Laboratory for Multiscale Innovative Technologies" == data["name"]
        assert "@" in data["email"]


# ============ /api/research-focus ============
class TestResearchFocus:
    def test_research_focus_returns_4_sorted(self, session):
        r = session.get(f"{API}/research-focus", timeout=TIMEOUT)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 4, f"Expected 4, got {len(data)}"
        ids = [item["id"] for item in data]
        assert ids == sorted(ids), "Items not sorted by id ascending"
        for item in data:
            assert "_id" not in item
            for f in ["id", "title", "description", "image", "keywords"]:
                assert f in item
            assert isinstance(item["keywords"], list)
            assert len(item["keywords"]) > 0


# ============ /api/publications ============
class TestPublications:
    def test_publications_returns_6_sorted_desc(self, session):
        r = session.get(f"{API}/publications", timeout=TIMEOUT)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 6, f"Expected 6 publications, got {len(data)}"
        years = [item["year"] for item in data]
        assert years == sorted(years, reverse=True), f"Years not desc-sorted: {years}"
        for item in data:
            assert "_id" not in item
            for f in ["id", "title", "authors", "year", "journal", "doi", "pdf"]:
                assert f in item
            assert isinstance(item["year"], int)
            # DOI present
            assert item["doi"]

    def test_publications_with_limit(self, session):
        r = session.get(f"{API}/publications", params={"limit": 3}, timeout=TIMEOUT)
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 3
        years = [item["year"] for item in data]
        assert years == sorted(years, reverse=True)

    def test_publications_with_year_filter(self, session):
        r = session.get(f"{API}/publications", params={"year": 2024}, timeout=TIMEOUT)
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        for item in data:
            assert item["year"] == 2024

    def test_publications_year_no_match(self, session):
        r = session.get(f"{API}/publications", params={"year": 1900}, timeout=TIMEOUT)
        assert r.status_code == 200
        assert r.json() == []


# ============ /api/lab-members ============
class TestLabMembers:
    def test_lab_members_returns_6_sorted(self, session):
        r = session.get(f"{API}/lab-members", timeout=TIMEOUT)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 6, f"Expected 6 members, got {len(data)}"
        ids = [item["id"] for item in data]
        assert ids == sorted(ids)
        for item in data:
            assert "_id" not in item
            for f in ["id", "name", "title", "image", "bio", "research", "email", "linkedin", "scholar"]:
                assert f in item
            assert isinstance(item["research"], list)
            assert len(item["research"]) > 0


# ============ /api/news ============
class TestNews:
    def test_news_returns_3_sorted_desc(self, session):
        r = session.get(f"{API}/news", timeout=TIMEOUT)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 3, f"Expected 3 news, got {len(data)}"
        dates = [item["date"] for item in data]
        assert dates == sorted(dates, reverse=True), f"Dates not desc-sorted: {dates}"
        for item in data:
            assert "_id" not in item
            for f in ["id", "title", "date", "excerpt", "image"]:
                assert f in item

    def test_news_with_limit(self, session):
        r = session.get(f"{API}/news", params={"limit": 2}, timeout=TIMEOUT)
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 2


# ============ /api/contact ============
class TestContact:
    def test_submit_valid_contact_and_persist(self, session):
        payload = {
            "name": "TEST_John Doe",
            "email": "test.john@example.com",
            "subject": "TEST_Inquiry about research collaboration",
            "message": "TEST_Hello, I would like to discuss potential collaboration on nanotechnology research."
        }
        r = session.post(f"{API}/contact", json=payload, timeout=TIMEOUT)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["success"] is True
        assert "submission_id" in data
        assert isinstance(data["submission_id"], str) and len(data["submission_id"]) > 0
        assert data["message"]
        # UUID format
        assert re.match(r"^[0-9a-f-]{36}$", data["submission_id"])

    def test_contact_missing_name(self, session):
        payload = {
            "email": "x@example.com",
            "subject": "Hi",
            "message": "Test"
        }
        r = session.post(f"{API}/contact", json=payload, timeout=TIMEOUT)
        assert r.status_code == 422

    def test_contact_missing_email(self, session):
        payload = {"name": "X", "subject": "Hi", "message": "Test"}
        r = session.post(f"{API}/contact", json=payload, timeout=TIMEOUT)
        assert r.status_code == 422

    def test_contact_missing_subject(self, session):
        payload = {"name": "X", "email": "x@example.com", "message": "Test"}
        r = session.post(f"{API}/contact", json=payload, timeout=TIMEOUT)
        assert r.status_code == 422

    def test_contact_missing_message(self, session):
        payload = {"name": "X", "email": "x@example.com", "subject": "Hi"}
        r = session.post(f"{API}/contact", json=payload, timeout=TIMEOUT)
        assert r.status_code == 422

    def test_contact_invalid_email(self, session):
        payload = {
            "name": "TEST_User",
            "email": "not-an-email",
            "subject": "Test",
            "message": "Body"
        }
        r = session.post(f"{API}/contact", json=payload, timeout=TIMEOUT)
        assert r.status_code == 422

    def test_contact_empty_field(self, session):
        payload = {"name": "", "email": "x@example.com", "subject": "S", "message": "M"}
        r = session.post(f"{API}/contact", json=payload, timeout=TIMEOUT)
        assert r.status_code == 422


# ============ CORS ============
class TestCORS:
    def test_cors_headers(self, session):
        r = session.options(
            f"{API}/lab-info",
            headers={
                "Origin": "https://example.com",
                "Access-Control-Request-Method": "GET",
            },
            timeout=TIMEOUT,
        )
        # CORS preflight should be allowed
        assert r.status_code in (200, 204), r.text
        assert "access-control-allow-origin" in {k.lower() for k in r.headers.keys()}
