"use client";

import MenuContent from "@/components/customer/MenuContent";

export default function TableMenuPage({ params }: { params: { tableId: string } }) {
  return <MenuContent mode="dine-in" tableId={params.tableId} />;
}
