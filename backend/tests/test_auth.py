def test_token_and_register(test_client):
    # register a new user
    resp = test_client.post("/auth/register", json={"username": "u1", "password":"secret1", "role":"engineer"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["username"] == "u1"

    # login with wrong creds
    resp = test_client.post("/auth/token", data={"username":"u1","password":"wrong"})
    assert resp.status_code == 401

    # login correct
    resp = test_client.post("/auth/token", data={"username":"u1","password":"secret1"})
    assert resp.status_code == 200
    assert "access_token" in resp.json()
