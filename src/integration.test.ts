import { Settings } from "luxon";

import BugzillaAPI from ".";

// Force all times to UTC.
Settings.defaultZone = "UTC";

// Tests that rely on the network are not ideal but it's hard to otherwise
// verify that we can parse data from the real services.

test("Mozilla", async () => {
  let api = new BugzillaAPI("https://bugzilla.mozilla.org/");

  await expect(
    api.getBugs([645699, 1743832, 1749908]),
  ).resolves.toMatchSnapshot();
});

test("Red Hat", async () => {
  let api = new BugzillaAPI("https://bugzilla.redhat.com/");

  await expect(
    api.getBugs([1944441, 1749908, 1205830]),
  ).resolves.toMatchSnapshot();
});
