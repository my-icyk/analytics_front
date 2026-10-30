export type ChangeType = "added" | "changed" | "fixed" | "removed";

export type ChangelogEntry = {
  type: ChangeType;
  module: string;
  description: string;
};

export type ChangelogRelease = {
  version: string;
  date: string;
  title: string;
  changes: ChangelogEntry[];
};

export const changelog: ChangelogRelease[] = [
  {
    version: "1.0.1",
    date: "2026-10-30",
    title: "Bug Fixes and Improvements",
    changes: [
      {
        type: "fixed",
        module: "Finance",
        description:
          "Resolved an issue with department repartitions not displaying correctly.",
      },
      {
        type: "changed",
        module: "App",
        description: "Updated the navigation menu for better user experience.",
      },
      {
        type: "fixed",
        module: "Finance",
        description:
          "Didnt work the filter on group and department repartitions pages",
      },
      {
        type: "added",
        module: "App",
        description: "Added changelog page to track application changes.",
      },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-10-29",
    title: "Initial Production Release",
    changes: [
      {
        type: "added",
        module: "App",
        description:
          "Replaced the legacy finance application with a newly developed platform.",
      },
      {
        type: "added",
        module: "Administration",
        description:
          "Implemented user, role, and permission management with role-based access control.",
      },
      {
        type: "added",
        module: "Administration",
        description:
          "Created user accounts and assigned appropriate roles and permissions.",
      },
      {
        type: "added",
        module: "Finance",
        description: "Implemented financial results management.",
      },
      {
        type: "added",
        module: "Finance",
        description:
          "Added management pages for groups, department repartitions, rules, rule targets, and departments.",
      },
      {
        type: "added",
        module: "Finance",
        description: "Implemented CRUD operations for financial entities.",
      },
      {
        type: "added",
        module: "App",
        description:
          "Introduced a new application interface with navigation, data tables, forms, and filtering.",
      },
      {
        type: "added",
        module: "Deployment",
        description: "Deployed the new application to the production server.",
      },
    ],
  },
];
