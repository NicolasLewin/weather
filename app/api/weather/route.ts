import { NextRequest, NextResponse } from "next/server";

export async function GET(request: any) {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address');
    const latitude = searchParams.get("lat");
    const longitude = searchParams.get("lon");

    let url = "";
    if(address) {
        url = "https://api.openweathermap.org/data/2.5/weather?q=" + address + "&appid=" + "060bfd7cdbd51abe374082b0ac7aabe6"
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=060bfd7cdbd51abe374082b0ac7aabe6`;
    }

    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json({ data });

}