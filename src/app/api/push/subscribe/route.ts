import { NextRequest, NextResponse } from 'next/server';

// Stockage temporaire en mémoire (en production, utiliser une DB)
const subscriptions = new Map<string, PushSubscriptionData>();

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const data: PushSubscriptionData = await request.json();

    if (!data.endpoint || !data.keys?.p256dh || !data.keys?.auth) {
      return NextResponse.json(
        { error: 'Subscription invalide' },
        { status: 400 }
      );
    }

    // Stocker la subscription (utiliser l'endpoint comme clé unique)
    subscriptions.set(data.endpoint, data);

    // Log pour debug (à supprimer en production)
    console.log(`Nouvelle subscription: ${data.endpoint.substring(0, 50)}...`);

    return NextResponse.json(
      { success: true, message: 'Subscription enregistrée' },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement de la subscription' },
      { status: 500 }
    );
  }
}
