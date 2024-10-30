import { readData } from "@/helper/utils";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const getData = await readData();
    return NextResponse.json(getData, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error); 
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
