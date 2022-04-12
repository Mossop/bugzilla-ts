const { spawnSync } = require("child_process");

beforeAll(() => {
  spawnSync(
    "docker",
    ["exec", "bugzilla-ts-test", "/usr/local/bin/backup-db"],
    {
      stdio: "inherit",
    },
  );
});

afterAll(() => {
  spawnSync(
    "docker",
    ["exec", "bugzilla-ts-test", "/usr/local/bin/restore-db"],
    {
      stdio: "inherit",
    },
  );
});
