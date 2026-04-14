import { NextRequest, NextResponse } from 'next/server';
import { pushLogger } from '@/lib/utils/logger';

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

    pushLogger.debug(`Nouvelle subscription: ${data.endpoint.substring(0, 50)}...`);

    return NextResponse.json(
      { success: true, message: 'Subscription enregistrée' },
      { status: 201 }
    );
  } catch (error) {
    pushLogger.error('Erreur lors de la sauvegarde de la subscription:', { error });
    return NextResponse.json(
      { 
        error: 'Erreur lors de la sauvegarde de la subscription',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
