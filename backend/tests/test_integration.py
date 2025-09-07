def test_full_flow(test_client):
    # manager creates project
    tok_m = test_client.post("/auth/token", data={"username":"manager","password":"managerpass"}).json()["access_token"]
    headers_m = {"Authorization": f"Bearer {tok_m}"}
    test_client.post("/projects/", json={"name":"IntProj", "description":"Integration"}, headers=headers_m)
    projects = test_client.get("/projects/", headers=headers_m).json()
    pid = projects[0]["id"]

    # engineer creates defect
    tok_e = test_client.post("/auth/token", data={"username":"engineer","password":"engineerpass"}).json()["access_token"]
    headers_e = {"Authorization": f"Bearer {tok_e}"}
    r = test_client.post("/defects/", json={"title":"Door misalign", "description":"Misaligned door", "priority":2, "project_id":pid}, headers=headers_e)
    assert r.status_code == 200
    did = r.json()["id"]

    # manager assigns defect to engineer (update)
    r2 = test_client.put(f"/defects/{did}", json={"assigned_to": 2}, headers=headers_m)
    assert r2.status_code == 200
    assert r2.json()["assigned_to"] == 2
