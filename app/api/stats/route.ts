// /app/api/stats/route.ts

export async function GET(request: Request) {
  try {
    const externalRes = await fetch(
      `https://radio.limeradio.net/api/nowplaying/lime?t=${new Date().toISOString()}`
    );

    if (!externalRes.ok) {
      throw new Error(`Failed to fetch: ${externalRes.statusText}`);
    }

    const data = await externalRes.json();

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "An error occurred. Please try again later." }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
