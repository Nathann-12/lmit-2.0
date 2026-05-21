"""Backend API tests for Admin Panel (Auth + CRUD) endpoints."""
import os
import uuid
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load frontend .env to get REACT_APP_BACKEND_URL (public URL)
load_dotenv(Path(__file__).resolve().parents[2] / "frontend" / ".env")

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_API = f"{API}/admin"

TIMEOUT = 30

ADMIN_EMAIL = "admin@multiscalelab.edu"
ADMIN_PASSWORD = "LabAdmin2024!"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(
        f"{API}/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=TIMEOUT,
    )
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data
    return data["access_token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ============ Auth ============
class TestAuth:
    def test_login_success(self, session):
        r = session.post(
            f"{API}/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            timeout=TIMEOUT,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "access_token" in data and isinstance(data["access_token"], str)
        assert data.get("token_type", "").lower() == "bearer"
        assert "user" in data
        user = data["user"]
        assert user["email"] == ADMIN_EMAIL
        assert user["role"] == "admin"
        assert "id" in user
        assert "password_hash" not in user
        assert "_id" not in user

    def test_login_invalid_password(self, session):
        r = session.post(
            f"{API}/auth/login",
            json={"email": ADMIN_EMAIL, "password": "WrongPassword!"},
            timeout=TIMEOUT,
        )
        assert r.status_code == 401

    def test_login_unknown_email(self, session):
        r = session.post(
            f"{API}/auth/login",
            json={"email": "nobody@nowhere.com", "password": "x"},
            timeout=TIMEOUT,
        )
        assert r.status_code == 401

    def test_login_email_case_insensitive(self, session):
        r = session.post(
            f"{API}/auth/login",
            json={"email": ADMIN_EMAIL.upper(), "password": ADMIN_PASSWORD},
            timeout=TIMEOUT,
        )
        assert r.status_code == 200

    def test_login_invalid_payload(self, session):
        r = session.post(f"{API}/auth/login", json={"email": "bad", "password": "x"}, timeout=TIMEOUT)
        assert r.status_code == 422

    def test_me_with_token(self, session, auth_headers):
        r = session.get(f"{API}/auth/me", headers=auth_headers, timeout=TIMEOUT)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        assert "password_hash" not in data
        assert "_id" not in data

    def test_me_without_token(self, session):
        # Send without auth header (use a fresh requests call to bypass session headers)
        r = requests.get(f"{API}/auth/me", timeout=TIMEOUT)
        assert r.status_code == 401

    def test_me_with_invalid_token(self, session):
        r = requests.get(
            f"{API}/auth/me",
            headers={"Authorization": "Bearer not.a.real.jwt.token"},
            timeout=TIMEOUT,
        )
        assert r.status_code == 401

    def test_me_with_malformed_header(self, session):
        r = requests.get(
            f"{API}/auth/me",
            headers={"Authorization": "Token abc"},
            timeout=TIMEOUT,
        )
        assert r.status_code == 401


# ============ Authorization Guard on Admin Endpoints ============
class TestAdminAuthGuard:
    @pytest.mark.parametrize(
        "method,path,payload",
        [
            ("PUT", "/lab-info", {}),
            ("POST", "/research-focus", {}),
            ("PUT", "/research-focus/1", {}),
            ("DELETE", "/research-focus/1", None),
            ("POST", "/publications", {}),
            ("PUT", "/publications/1", {}),
            ("DELETE", "/publications/1", None),
            ("POST", "/lab-members", {}),
            ("PUT", "/lab-members/1", {}),
            ("DELETE", "/lab-members/1", None),
            ("POST", "/news", {}),
            ("PUT", "/news/1", {}),
            ("DELETE", "/news/1", None),
            ("GET", "/contact-submissions", None),
            ("DELETE", "/contact-submissions/abc", None),
        ],
    )
    def test_admin_endpoints_require_auth(self, method, path, payload):
        url = f"{ADMIN_API}{path}"
        r = requests.request(method, url, json=payload, timeout=TIMEOUT)
        assert r.status_code == 401, f"{method} {path} expected 401, got {r.status_code}"

    @pytest.mark.parametrize(
        "method,path",
        [
            ("PUT", "/lab-info"),
            ("POST", "/research-focus"),
            ("GET", "/contact-submissions"),
        ],
    )
    def test_admin_endpoints_reject_bad_token(self, method, path):
        url = f"{ADMIN_API}{path}"
        r = requests.request(
            method,
            url,
            json={},
            headers={"Authorization": "Bearer garbage"},
            timeout=TIMEOUT,
        )
        assert r.status_code == 401


# ============ Lab Info Update ============
class TestLabInfoAdmin:
    def test_update_lab_info(self, session, auth_headers):
        # Get current state
        current = session.get(f"{API}/lab-info", timeout=TIMEOUT).json()
        original_tagline = current.get("tagline", "")

        payload = {**current, "tagline": "TEST_TAGLINE_UPDATED"}
        r = session.put(f"{ADMIN_API}/lab-info", json=payload, headers=auth_headers, timeout=TIMEOUT)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["tagline"] == "TEST_TAGLINE_UPDATED"
        assert "_id" not in data

        # Verify persistence via public GET
        r2 = session.get(f"{API}/lab-info", timeout=TIMEOUT)
        assert r2.json()["tagline"] == "TEST_TAGLINE_UPDATED"

        # Restore
        restore = {**current, "tagline": original_tagline}
        session.put(f"{ADMIN_API}/lab-info", json=restore, headers=auth_headers, timeout=TIMEOUT)


# ============ Research Focus CRUD ============
class TestResearchFocusAdmin:
    def test_full_crud_lifecycle(self, session, auth_headers):
        payload = {
            "title": "TEST_Quantum Materials",
            "description": "TEST description",
            "image": "https://example.com/img.jpg",
            "keywords": ["quantum", "materials"],
        }
        # CREATE
        r = session.post(f"{ADMIN_API}/research-focus", json=payload, headers=auth_headers, timeout=TIMEOUT)
        assert r.status_code == 200, r.text
        created = r.json()
        assert isinstance(created["id"], int) and created["id"] >= 1
        assert created["title"] == payload["title"]
        assert created["keywords"] == payload["keywords"]
        assert "_id" not in created
        new_id = created["id"]

        # Verify via public GET
        public_list = session.get(f"{API}/research-focus", timeout=TIMEOUT).json()
        assert any(it["id"] == new_id and it["title"] == payload["title"] for it in public_list)

        # UPDATE
        update_payload = {**payload, "title": "TEST_Quantum Materials Updated"}
        r2 = session.put(
            f"{ADMIN_API}/research-focus/{new_id}",
            json=update_payload,
            headers=auth_headers,
            timeout=TIMEOUT,
        )
        assert r2.status_code == 200, r2.text
        assert r2.json()["title"] == "TEST_Quantum Materials Updated"

        # UPDATE non-existent -> 404
        r3 = session.put(
            f"{ADMIN_API}/research-focus/999999",
            json=update_payload,
            headers=auth_headers,
            timeout=TIMEOUT,
        )
        assert r3.status_code == 404

        # DELETE
        r4 = session.delete(f"{ADMIN_API}/research-focus/{new_id}", headers=auth_headers, timeout=TIMEOUT)
        assert r4.status_code == 200
        assert r4.json().get("success") is True

        # DELETE non-existent -> 404
        r5 = session.delete(f"{ADMIN_API}/research-focus/{new_id}", headers=auth_headers, timeout=TIMEOUT)
        assert r5.status_code == 404


# ============ Publications CRUD ============
class TestPublicationsAdmin:
    def test_full_crud_lifecycle(self, session, auth_headers):
        payload = {
            "title": "TEST_Publication Paper",
            "authors": "Test, A.; Doe, J.",
            "year": 2025,
            "journal": "Test Journal",
            "doi": "10.0000/test.2025.001",
            "pdf": "#",
        }
        r = session.post(f"{ADMIN_API}/publications", json=payload, headers=auth_headers, timeout=TIMEOUT)
        assert r.status_code == 200, r.text
        created = r.json()
        assert isinstance(created["id"], int)
        assert created["year"] == 2025
        assert "_id" not in created
        pid = created["id"]

        # UPDATE
        upd = {**payload, "title": "TEST_Publication Updated"}
        r2 = session.put(f"{ADMIN_API}/publications/{pid}", json=upd, headers=auth_headers, timeout=TIMEOUT)
        assert r2.status_code == 200
        assert r2.json()["title"] == "TEST_Publication Updated"

        # UPDATE 404
        assert session.put(
            f"{ADMIN_API}/publications/999999", json=upd, headers=auth_headers, timeout=TIMEOUT
        ).status_code == 404

        # Verify via public GET (year filter)
        pub_list = session.get(f"{API}/publications", params={"year": 2025}, timeout=TIMEOUT).json()
        assert any(p["id"] == pid for p in pub_list)

        # DELETE
        r3 = session.delete(f"{ADMIN_API}/publications/{pid}", headers=auth_headers, timeout=TIMEOUT)
        assert r3.status_code == 200

        # DELETE 404
        assert session.delete(
            f"{ADMIN_API}/publications/{pid}", headers=auth_headers, timeout=TIMEOUT
        ).status_code == 404


# ============ Lab Members CRUD ============
class TestLabMembersAdmin:
    def test_full_crud_lifecycle(self, session, auth_headers):
        payload = {
            "name": "TEST_Dr. Lab Member",
            "title": "Research Scientist",
            "image": "https://example.com/m.jpg",
            "bio": "TEST bio",
            "research": ["topic1", "topic2"],
            "email": "test.member@example.com",
        }
        r = session.post(f"{ADMIN_API}/lab-members", json=payload, headers=auth_headers, timeout=TIMEOUT)
        assert r.status_code == 200, r.text
        created = r.json()
        mid = created["id"]
        assert created["name"] == payload["name"]
        # Defaults
        assert created["linkedin"] == "#"
        assert created["scholar"] == "#"
        assert "_id" not in created

        upd = {**payload, "name": "TEST_Dr. Updated"}
        r2 = session.put(f"{ADMIN_API}/lab-members/{mid}", json=upd, headers=auth_headers, timeout=TIMEOUT)
        assert r2.status_code == 200
        assert r2.json()["name"] == "TEST_Dr. Updated"

        # UPDATE 404
        assert session.put(
            f"{ADMIN_API}/lab-members/999999", json=upd, headers=auth_headers, timeout=TIMEOUT
        ).status_code == 404

        # DELETE
        assert session.delete(
            f"{ADMIN_API}/lab-members/{mid}", headers=auth_headers, timeout=TIMEOUT
        ).status_code == 200
        # DELETE 404
        assert session.delete(
            f"{ADMIN_API}/lab-members/{mid}", headers=auth_headers, timeout=TIMEOUT
        ).status_code == 404


# ============ News CRUD ============
class TestNewsAdmin:
    def test_full_crud_lifecycle(self, session, auth_headers):
        payload = {
            "title": "TEST_News headline",
            "date": "2025-12-01",
            "excerpt": "TEST excerpt",
            "image": "https://example.com/n.jpg",
        }
        r = session.post(f"{ADMIN_API}/news", json=payload, headers=auth_headers, timeout=TIMEOUT)
        assert r.status_code == 200, r.text
        nid = r.json()["id"]

        upd = {**payload, "title": "TEST_News updated"}
        r2 = session.put(f"{ADMIN_API}/news/{nid}", json=upd, headers=auth_headers, timeout=TIMEOUT)
        assert r2.status_code == 200
        assert r2.json()["title"] == "TEST_News updated"

        assert session.put(
            f"{ADMIN_API}/news/999999", json=upd, headers=auth_headers, timeout=TIMEOUT
        ).status_code == 404

        assert session.delete(
            f"{ADMIN_API}/news/{nid}", headers=auth_headers, timeout=TIMEOUT
        ).status_code == 200
        assert session.delete(
            f"{ADMIN_API}/news/{nid}", headers=auth_headers, timeout=TIMEOUT
        ).status_code == 404


# ============ Contact Submissions Admin ============
class TestContactSubmissionsAdmin:
    def test_list_and_delete_submissions(self, session, auth_headers):
        # Create a submission via public endpoint
        unique = uuid.uuid4().hex[:8]
        payload = {
            "name": f"TEST_Submitter_{unique}",
            "email": f"t_{unique}@example.com",
            "subject": "TEST_admin_list_subject",
            "message": "TEST message body for admin listing test.",
        }
        post_r = session.post(f"{API}/contact", json=payload, timeout=TIMEOUT)
        assert post_r.status_code == 200
        sub_id = post_r.json()["submission_id"]

        # List
        r = session.get(f"{ADMIN_API}/contact-submissions", headers=auth_headers, timeout=TIMEOUT)
        assert r.status_code == 200, r.text
        items = r.json()
        assert isinstance(items, list)
        # _id should be excluded
        for it in items:
            assert "_id" not in it
        # Sorted desc by submitted_at
        timestamps = [it["submitted_at"] for it in items]
        assert timestamps == sorted(timestamps, reverse=True), "Submissions not sorted desc by submitted_at"
        # Our submission present
        ours = [it for it in items if it["id"] == sub_id]
        assert len(ours) == 1
        assert ours[0]["name"] == payload["name"]

        # DELETE
        d = session.delete(
            f"{ADMIN_API}/contact-submissions/{sub_id}", headers=auth_headers, timeout=TIMEOUT
        )
        assert d.status_code == 200
        # DELETE 404
        d2 = session.delete(
            f"{ADMIN_API}/contact-submissions/{sub_id}", headers=auth_headers, timeout=TIMEOUT
        )
        assert d2.status_code == 404


# ============ Public endpoints still work without auth ============
class TestPublicStillWorks:
    @pytest.mark.parametrize("path", [
        "/lab-info", "/research-focus", "/publications", "/lab-members", "/news",
    ])
    def test_public_no_auth(self, session, path):
        r = requests.get(f"{API}{path}", timeout=TIMEOUT)
        assert r.status_code == 200
