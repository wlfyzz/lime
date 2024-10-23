export async function GET(request: Request) {
  try {
    // Fetch data from AzuraCast
    const externalRes = await fetch(
      `https://radio.limeradio.net/api/nowplaying/lime?t=${new Date().toISOString()}`, { cache: "no-store" }
    );
    if (!externalRes.ok) {
      throw new Error(`Failed to fetch: ${externalRes.statusText}`);
    }
    const azuracastData = await externalRes.json();
    const title = azuracastData.now_playing.song.title;
    const artist = azuracastData.now_playing.song.artist;
    const data = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': '7a18eb12401c4d0387c1355fe10278a8',
        'client_secret': '05425579d1ad405e8c710cc2dc2dfa6a'
      })
    });
    const json = await data.json()
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(`${title} by ${artist}`)}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${json.access_token}`,
        },
        cache: "no-store",
      }
    );

    if (!spotifyRes.ok) {
      throw new Error(`Failed to fetch: ${spotifyRes.statusText}`);
    }
    const spotifyData = await spotifyRes.json();
    const iconUrl = spotifyData.tracks.items[0]?.album.images[0]?.url;
    azuracastData.now_playing.song.art = iconUrl

    const repackagedData = {
      data: {
      now_playing: azuracastData.now_playing,
      live: azuracastData.live
    }}
    return new Response(JSON.stringify(repackagedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log(error)
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