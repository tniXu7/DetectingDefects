def test_export_csv(test_client):
    token = test_client.post("/auth/token", data={"username":"manager","password":"managerpass"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    # create project and defect
    test_client.post("/projects/", json={"name":"P3", "description":"Project 3"}, headers=headers)
    resp = test_client.get("/projects/", headers=headers)
    pid = resp.json()[0]["id"]
    test_client.post("/defects/", json={"title":"Crack", "description":"Wall crack", "priority":2, "project_id":pid}, headers=headers)
    r = test_client.get("/reports/defects/csv?project_id=" + str(pid), headers=headers)
    assert r.status_code == 200
    assert "id,title,description" in r.text
