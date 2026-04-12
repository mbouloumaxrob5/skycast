import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Clé API non configurée' },
      { status: 500 }
    );
  }
  
  if (!endpoint || !['weather', 'forecast'].includes(endpoint)) {
    return NextResponse.json(
      { error: 'Endpoint invalide' },
      { status: 400 }
    );
  }
  
  searchParams.delete('endpoint');
  searchParams.append('appid', apiKey);
  searchParams.append('units', 'metric');
  searchParams.append('lang', 'fr');
  
  const url = `https://api.openweathermap.org/data/2.5/${endpoint}?${searchParams}`;
  
  try {
    const res = await fetch(url, { 
      next: { revalidate: 300 },
      headers: { 'Accept': 'application/json' }
    });
    
    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { error: error.message || 'Erreur API météo' },
        { status: res.status }
      );
    }
    
    const data = await res.json();
    return NextResponse.json(data);
    
  } catch {
    return NextResponse.json(
      { error: 'Erreur de connexion' },
      { status: 503 }
    );
  }
}
