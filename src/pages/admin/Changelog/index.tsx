import { changelog, type ChangeType } from "@/data/changelog";
import { PageContainer } from "@ant-design/pro-components";
import {
  Card,
  Empty,
  Input,
  Select,
  Space,
  Tag,
  Timeline,
  Typography,
} from "antd";
import { useMemo, useState } from "react";

const { Text, Title } = Typography;

const changeConfig: Record<ChangeType, { label: string; color: string }> = {
  added: { label: "Added", color: "green" },
  changed: { label: "Changed", color: "blue" },
  fixed: { label: "Fixed", color: "orange" },
  removed: { label: "Removed", color: "red" },
};

export default function ChangelogPage() {
  const [search, setSearch] = useState("");
  const [module, setModule] = useState<string>();

  const modules = useMemo(
    () =>
      Array.from(
        new Set(
          changelog.flatMap((release) =>
            release.changes.map((change) => change.module),
          ),
        ),
      ).sort(),
    [],
  );

  const releases = useMemo(
    () =>
      changelog
        .map((release) => ({
          ...release,
          changes: release.changes.filter((change) => {
            const matchesModule = !module || change.module === module;

            const matchesSearch =
              !search ||
              [
                release.version,
                release.title,
                change.module,
                change.description,
              ]
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase());

            return matchesModule && matchesSearch;
          }),
        }))
        .filter((release) => release.changes.length > 0),
    [search, module],
  );

  return (
    <PageContainer
      title="Changelog"
      subTitle="Application updates and release history"
    >
      <Card>
        <Space wrap style={{ marginBottom: 24, width: "100%" }}>
          <Input.Search
            placeholder="Search changes"
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 280 }}
          />

          <Select
            placeholder="All modules"
            allowClear
            value={module}
            onChange={setModule}
            style={{ width: 180 }}
            options={modules.map((name) => ({
              label: name,
              value: name,
            }))}
          />
        </Space>

        {releases.length === 0 ? (
          <Empty description="No changes found" />
        ) : (
          <Timeline
            items={releases.map((release, index) => ({
              color: index === 0 ? "blue" : "gray",
              children: (
                <div style={{ paddingBottom: 16 }}>
                  <Space align="center" wrap style={{ marginBottom: 8 }}>
                    <Title level={5} style={{ margin: 0 }}>
                      v{release.version}
                    </Title>

                    {release.version === changelog[0]?.version && (
                      <Tag color="green">Latest</Tag>
                    )}

                    <Text type="secondary">{release.date}</Text>
                  </Space>

                  <Card size="small" title={release.title}>
                    <Space
                      direction="vertical"
                      size="middle"
                      style={{ width: "100%" }}
                    >
                      {release.changes.map((change, i) => {
                        const config = changeConfig[change.type];

                        return (
                          <Space key={i} align="start" wrap>
                            <Tag color={config.color}>{config.label}</Tag>

                            <Text type="secondary">{change.module}</Text>

                            <Text>{change.description}</Text>
                          </Space>
                        );
                      })}
                    </Space>
                  </Card>
                </div>
              ),
            }))}
          />
        )}
      </Card>
    </PageContainer>
  );
}
