def get_token(client, username, password):
    r = client.post("/auth/token", data={"username": username, "password": password})
    return r.json()["access_token"]

def test_project_create_and_list(test_client):
    token = get_token(test_client, "manager", "managerpass")
    headers = {"Authorization": f"Bearer {token}"}
    resp = test_client.post("/projects/", json={"name":"P1", "description":"Obj1"}, headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "P1"

    # list (any auth)
    token2 = get_token(test_client, "engineer", "engineerpass")
    headers2 = {"Authorization": f"Bearer {token2}"}
    resp = test_client.get("/projects/", headers=headers2)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
