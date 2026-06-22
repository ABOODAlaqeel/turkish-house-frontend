"use client";

import SmartCart from "@/components/customer/SmartCart";

export default function TableCartPage({ params }: { params: { tableId: string } }) {
  return <SmartCart mode="dine-in" tableId={params.tableId} />;
}
