import { NextRequest, NextResponse } from 'next/server';

// Référence au même Map que subscribe (en production, utiliser une DB)
const subscriptions = new Map<string, { endpoint: string; keys: { p256dh: string; auth: string } }>();

export async function POST(request: NextRequest) {
  try {
    const { endpoint }: { endpoint: string } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint requis' },
        { status: 400 }
      );
    }

    // Supprimer la subscription
    const deleted = subscriptions.delete(endpoint);

    if (!deleted) {
      return NextResponse.json(
        { warning: 'Subscription non trouvée' },
        { status: 200 }
      );
    }

    console.log(`Subscription supprimée: ${endpoint.substring(0, 50)}...`);

    return NextResponse.json(
      { success: true, message: 'Subscription supprimée' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la subscription' },
      { status: 500 }
    );
  }
}
