# Bugzilla | [![npm version](https://badgen.net/npm/v/bugzilla)](https://www.npmjs.com/package/bugzilla) [![Build](https://github.com/Mossop/bugzilla-ts/actions/workflows/build.yml/badge.svg)](https://github.com/Mossop/bugzilla-ts/actions/workflows/build.yml) [![codecov](https://codecov.io/gh/Mossop/bugzilla-ts/branch/main/graph/badge.svg)](https://codecov.io/gh/Mossop/bugzilla-ts)

Typesafe access to [Bugzilla's REST API](https://bugzilla.readthedocs.io/en/latest/api/index.html).

Very early work in progress, getting info from a bug or searching bugs is the main priority right
now.

No tests as yet. This is a quick and dirty implementation to support a side project I'm working on.

# API

## Creating the API instance

```javascript
import BugzillaAPI from "bugzilla";

let api = new BugzillaAPI("https://bugzilla.mozilla.org", "<api key>");
await api.version();
```

Or for username/password authentication:

```javascript
import BugzillaAPI from "bugzilla";

let api = new BugzillaAPI(
  "https://bugzilla.mozilla.org",
  "<username>",
  "<password>",
);
await api.version();
```

## Retrieving bugs by ID

```javascript
let bugs = await api.getBugs([123456, 123457]);
```

## Querying bugs

You can use a `quicksearch` string:

```javascript
let bugs = await api.quicksearch("severity:blocker,critical");
```

Or any advanced search which can be passed in a number of ways:

```javascript
// You can just pass a full advanced search url:
let bugs = await api.advancedSearch(
  "https://bugzilla.mozilla.org/buglist.cgi?email1=dtownsend%40mozilla.com&emailassigned_to1=1&resolution=---&emailtype1=exact&list_id=15603348",
);

// Or just the query string part:
let bugs = await api.advancedSearch(
  "email1=dtownsend%40mozilla.com&emailassigned_to1=1&resolution=---&emailtype1=exact&list_id=15603348",
);

// Or as a record:
let bugs = await api.advancedSearch({
  email1: "dtownsend@mozilla.com",
  emailassigned_to1: "1",
  resolution: "---",
  emailtype1: "exact",
});
```

## Filtering bug fields

To reduce bandwidth or improve performance it is possible to filter the fields returned by functions
that return bugs:

```javascript
// To only retrieve certain fields.
let bug = await api.getBugs([123456]).include(["id", "product", "component"]);

// Or to filter out certain fields.
let bug = await api.getBugs([123456]).exclude(["cc_detail"]);
```

Assuming you use a static array the returned types will correctly reflect to available fields.

Currently the `_all`, `_default`, `_extra` and `_custom` special field shortcuts are not currently
supported.

Custom fields are not currently returned.

## Retrieving comments by ID

```javascript
// .getComment() accepts one parameter, ID of comment, as number
let comment = await api.getComment(123456);
```

Return value is Comment object.

## Retrieving all comments of bug

```javascript
// .getComments() accepts one parameter, ID of bug, as number
let comments = await api.getBugComments(123456);
```

Return value is array of Comment objects.

## Creating comments

```javascript
let comment = await api.createComment(
  123456,
  "This is new comment on bug #123456",
  { is_private: false },
);
```

Returned value is ID of the newly-created comment.

## Creating bugs

```javascript
let bug = await api.createBug({
  product: "TestProduct",
  component: "TestComponent",
  version: "unspecified",
  summary: "'This is a test bug - please disregard",
  alias: "SomeAlias",
  op_sys: "All",
  priority: "P1",
  rep_platform: "All",
});
```

Returned value is ID of the newly-created bug.

## Updating bugs

Example of adding email address on cc list of bug #123456:

```javascript
let response = await api.updateBug(123456, {
  id_or_alias: 123456,
  cc: { add: "my@email.io" },
});
```

Returned value is same as described in Bugzilla [docs](https://bugzilla.readthedocs.io/en/latest/api/core/v1/bug.html#update-bug).
