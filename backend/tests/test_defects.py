def test_defect_crud(test_client):
    # create project as manager
    token = test_client.post("/auth/token", data={"username":"manager","password":"managerpass"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    test_client.post("/projects/", json={"name":"P2", "description":"Project 2"}, headers=headers)

    # create defect as engineer
    token2 = test_client.post("/auth/token", data={"username":"engineer","password":"engineerpass"}).json()["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}
    # find project id
    resp = test_client.get("/projects/", headers=headers2)
    pid = resp.json()[0]["id"]
    resp2 = test_client.post("/defects/", json={"title":"Leak", "description":"Ceiling leak", "priority":1, "project_id": pid}, headers=headers2)
    assert resp2.status_code == 200
    d = resp2.json()
    assert d["title"] == "Leak"

    # update status (engineer allowed)
    resp3 = test_client.put(f"/defects/{d['id']}", json={"status":"in_progress"}, headers=headers2)
    assert resp3.status_code == 200
    assert resp3.json()["status"] == "in_progress"
