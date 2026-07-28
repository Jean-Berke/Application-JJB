# OSS — application JJB

Réseau social pour le jiu-jitsu brésilien : ceinture vérifiée par le coach, bibliothèque de techniques, carnet personnel, open mats géolocalisés, et un rôle club/coach dédié (validation des grades, présences, cotisations).

Le nom « OSS » est provisoire.

## Stack

- **React Native + Expo** (SDK 54, TypeScript) — un seul code pour iOS et Android.
- **React Navigation** (stack + bottom tabs, deux barres d'onglets : pratiquant et club).
- Design system maison (couleurs, typographie Barlow / Barlow Condensed, composants réutilisables) fidèle au handoff de design original.
- **Données mockées en mémoire** pour l'instant (`src/data/mock.ts` + `src/data/store.tsx`) — pas de backend branché.

## Lancer le projet

```
npm install
npx expo start -c
```

Scanner le QR code avec l'app **Expo Go** (iOS/Android). Après chaque mise à jour du code :

```
git pull origin <branche>
npm install
npx expo start -c
```

Fermer complètement Expo Go avant de rescanner le QR code.

## État d'avancement

Les 6 étapes de développement recommandées sont construites (voir l'historique de commits) :

1. MVP (accueil, connexion, onboarding, fil, profil)
2. Ceintures vérifiées + rôle club
3. Open mats
4. Techniques & carnet
5. Social avancé (recherche, notifications, messages, paramètres)
6. Admin club (présences, encaissements)

## Décisions produit à retenir

- **La ceinture vérifiée est le cœur du produit.** Tout le reste peut être coupé, pas ça.
- **Lancement par académie, pas par ville.** Convaincre 3-5 salles proches plutôt que "les pratiquants de JJB" en général.
- **Le modèle économique repose sur les clubs** (abonnement salle/coach), pas sur un paywall pratiquant. Le gratuit doit rester généreux pour ne pas tuer l'effet réseau au lancement.

## Pistes futures (non prioritaires)

- **Vraie carte interactive pour les open mats.** La vue "Carte" actuelle est stylisée (points sur un fond simple). `react-native-maps` donnerait une vraie carte, mais nécessite de sortir d'Expo Go pour un build de développement natif (EAS Build). À faire quand on aura besoin de tester au-delà d'Expo Go.
- **Palier payant optionnel côté pratiquant**, en plus des abonnements clubs — à activer une fois qu'il y a une vraie base d'utilisateurs actifs, pas au lancement :
  - Carnet avancé (stats de progression, historique illimité, comparaison avec des partenaires).
  - Contenu technique premium par des instructeurs connus, avec partage de revenu (modèle type BJJ Fanatics) — un deuxième moteur de revenu indépendant des abonnements clubs.
  - Sans publicité, si des pubs sont introduites un jour.
- **Backend réel (Supabase)** : auth, persistance, RLS, storage média — nécessaire avant tout pilote réel avec une salle.
