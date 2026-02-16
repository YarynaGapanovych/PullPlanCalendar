"use client";

import Calendar from "@/app/components/Calendar";
import { Card } from "@/app/components/ui/Card";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { Tabs } from "@/app/components/ui/Tabs";
import { useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Area } from "../../../graphql/generated";
import { GET_ALL_AREAS } from "../../../graphql/queries/getAllAreas";

interface CalendarViewProps {
  showSwitcher?: boolean;
}

export default function CalendarView({ showSwitcher }: CalendarViewProps) {
  const params = useParams();
  const projectId = params.id;
  const { data, loading } = useQuery(GET_ALL_AREAS, {
    variables: { projectId },
  });

  const areas = useMemo(() => data?.getAreasByProject || [], [data]);

  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (areas.length > 0 && !activeTab) {
      setActiveTab(areas[0].id);
    }
  }, [areas, activeTab]);

  return (
    <div className="py-4">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="p-2"
        items={areas.map((area: Area) => ({
          key: area.id,
          label: (
            <div
              className={`px-4 py-2 rounded-t-lg transition ${
                activeTab === area.id
                  ? "bg-white shadow-md"
                  : "hover:bg-gray-100"
              }`}
            >
              {area.name}
            </div>
          ),
          children: (
            <Card className="relative px-4 bg-white border rounded-lg">
              {loading ? (
                <LoadingSpinner />
              ) : (
                <Calendar showSwitcher={showSwitcher} areaId={activeTab} />
              )}
            </Card>
          ),
        }))}
      />
    </div>
  );
}
