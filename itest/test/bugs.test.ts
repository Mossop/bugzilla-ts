import BugzillaAPI from "../../src";

test("Create bug", async () => {
  let api = new BugzillaAPI(
    "http://localhost:8088/bugzilla/",
    "admin@nowhere.com",
    "adminpass",
  );

  await expect(
    api.createBug({
      product: "TestProduct",
      component: "TestComponent",
      summary: "A test bug",
      version: "unspecified",
      description: "This is a test bug",
      op_sys: "Mac OS",
      platform: "Macintosh",
      priority: "High",
      severity: "major",
    }),
  ).resolves.toBe(1);

  let bugs = await api.getBugs([1]);
  expect(bugs).toEqual([
    {
      alias: [],
      assigned_to: "admin@nowhere.com",
      assigned_to_detail: {
        id: 1,
        name: "admin@nowhere.com",
        real_name: "Insecure User",
      },
      blocks: [],
      cc: [],
      cc_detail: [],
      classification: "Unclassified",
      component: "TestComponent",
      creation_time: expect.anything(),
      creator: "admin@nowhere.com",
      creator_detail: {
        id: 1,
        name: "admin@nowhere.com",
        real_name: "Insecure User",
      },
      depends_on: [],
      dupe_of: null,
      flags: [],
      groups: [],
      id: 1,
      is_cc_accessible: true,
      is_confirmed: true,
      is_creator_accessible: true,
      is_open: true,
      keywords: [],
      last_change_time: expect.anything(),
      op_sys: "Mac OS",
      platform: "Macintosh",
      priority: "High",
      product: "TestProduct",
      qa_contact: "",
      qa_contact_detail: undefined,
      resolution: "",
      see_also: [],
      severity: "major",
      status: "CONFIRMED",
      summary: "A test bug",
      target_milestone: "---",
      update_token: undefined,
      url: "",
      version: "unspecified",
      whiteboard: "",
    },
  ]);

  await expect(api.quicksearch("ALL")).resolves.toEqual(bugs);
});
