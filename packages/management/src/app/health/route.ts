import { NextResponse } from "next/server";

export const GET = function () {
  return new NextResponse("OK", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

