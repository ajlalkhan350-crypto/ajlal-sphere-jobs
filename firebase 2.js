/**
 * Sphere — Firebase web config
 *
 * 1) Firebase Console → Project settings → Your apps → Web app
 * 2) Copy the six values into SPHERE_FIREBASE below.
 *
 * This web config is meant to be public (GitHub Pages cannot hide it).
 * Security comes from Auth + firestore.rules — never put an Admin / service-account
 * private key, or any secret server key, in this file.
 */
window.SPHERE_FIREBASE = {
  apiKey: "AIzaSyDpDfnuc_Ct7Kddtgv7mwOtryf8zAX7Y1w",
  authDomain: "sphere-ksa.firebaseapp.com",
  projectId: "sphere-ksa",
  storageBucket: "sphere-ksa.firebasestorage.app",
  messagingSenderId: "1088058666347",
  appId: "1:1088058666347:web:a60701616d6afb8ad702e"
};

window.sphereFb = { ready: false, auth: null, db: null };

(function initSphereFirebase() {
  const cfg = window.SPHERE_FIREBASE || {};
  const filled = !!(cfg.apiKey && cfg.projectId && cfg.apiKey.length > 12 && cfg.projectId.length > 2);
  if (!filled) return;
  if (typeof firebase === "undefined") return;
  try {
    if (!firebase.apps.length) firebase.initializeApp(cfg);
    const auth = firebase.auth();
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    window.sphereFb = {
      ready: true,
      auth: auth,
      db: firebase.firestore()
    };
  } catch (err) {
    console.warn("Sphere Firebase init failed", err);
    window.sphereFb = { ready: false, auth: null, db: null };
  }
})();
