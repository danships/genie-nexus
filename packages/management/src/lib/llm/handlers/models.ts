import { NextResponse } from "next/server";

export function handleModels(): Response {
  return NextResponse.json({
    type: "list",
    data: [
      {
        type: "genie-nexus-model",
        created: 1758225573,
        object: "model",
        owned_by: "genie-nexus",
      },
    ],
  });
}
