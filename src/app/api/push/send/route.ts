import { NextRequest, NextResponse } from 'next/server';

// NOTE: Pour activer les push notifications serveur:
// 1. npm install web-push
// 2. Générer des clés VAPID: npx web-push generate-vapid-keys
// 3. Ajouter les clés dans .env.local
// 4. Décommenter et implémenter ce fichier

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Web Push serveur non activé',
      message: 'Les notifications côté client fonctionnent. Pour le serveur, installer web-push.'
    },
    { status: 501 }
  );
}

export async function GET() {
  return NextResponse.json(
    { 
      status: 'disabled',
      message: 'Endpoint désactivé. Installer web-push pour activer.'
    },
    { status: 200 }
  );
}
