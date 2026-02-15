
import * as firestore from "firebase/firestore";
import { UserProfile, UserProgress, LessonStatus, UserRole } from "../types";

export const FirebaseService = {
  /**
   * Fetches user profile with strict typing
   */
  async getUserProfile(db: firestore.Firestore, uid: string): Promise<UserProfile | null> {
    const docRef = firestore.doc(db, "users", uid);
    const snap = await firestore.getDoc(docRef);
    return snap.exists() ? (snap.data() as UserProfile) : null;
  },

  /**
   * Specifically fetches the role of a user for rapid permission checks
   */
  async getUserRole(db: firestore.Firestore, uid: string): Promise<UserRole | null> {
    const docRef = firestore.doc(db, "users", uid);
    const snap = await firestore.getDoc(docRef);
    if (snap.exists()) {
      return (snap.data() as UserProfile).role;
    }
    return null;
  },

  /**
   * Stores or updates a user's role in their profile
   */
  async setUserRole(db: firestore.Firestore, uid: string, role: UserRole) {
    const docRef = firestore.doc(db, "users", uid);
    await firestore.setDoc(docRef, { role }, { merge: true });
  },

  /**
   * Fetches user progress from subcollection (Scalable Pattern)
   */
  async getUserProgress(db: firestore.Firestore, uid: string): Promise<UserProgress[]> {
    const progressRef = firestore.collection(db, "users", uid, "progress");
    const snap = await firestore.getDocs(progressRef);
    return snap.docs.map(doc => doc.data() as UserProgress);
  },

  /**
   * Records a code submission for audit and analytics.
   */
  async recordSubmission(
    db: firestore.Firestore,
    uid: string,
    problemId: string,
    code: string,
    language: string,
    success: boolean
  ) {
    const submissionRef = firestore.collection(db, "submissions");
    await firestore.addDoc(submissionRef, {
      uid,
      problemId,
      code,
      language,
      success,
      timestamp: firestore.serverTimestamp()
    });

    if (success) {
      const solvedRef = firestore.doc(db, "users", uid, "solvedProblems", problemId);
      await firestore.setDoc(solvedRef, { solvedAt: firestore.serverTimestamp() });
    }
  },

  /**
   * Updates progress, XP, and Leaderboard atomically.
   */
  async updateProgress(
    db: firestore.Firestore, 
    uid: string, 
    moduleId: string, 
    status: LessonStatus,
    xpGain: number,
    email: string
  ) {
    const batch = firestore.writeBatch(db);
    
    // 1. Update module progress subcollection
    const progressRef = firestore.doc(db, "users", uid, "progress", moduleId);
    batch.set(progressRef, {
      moduleId,
      status,
      lastAttempted: firestore.serverTimestamp()
    }, { merge: true });

    // 2. Update user profile (XP & Streak)
    const userRef = firestore.doc(db, "users", uid);
    batch.update(userRef, {
      xp: firestore.increment(xpGain),
      lastActive: firestore.serverTimestamp()
    });

    // 3. Update Denormalized Leaderboard
    const leaderboardRef = firestore.doc(db, "leaderboard", uid);
    batch.set(leaderboardRef, {
      uid,
      displayName: email.split('@')[0],
      xp: firestore.increment(xpGain),
      lastUpdated: firestore.serverTimestamp()
    }, { merge: true });

    await batch.commit();
  },

  /**
   * Stripe Checkout Simulation
   */
  async createStripeSession(uid: string) {
    console.log("Initializing OIDC Secure Payment for:", uid);
    window.open("https://ai.google.dev/gemini-api/docs/billing", "_blank");
  },

  /**
   * Fetch Global Leaderboard (Optimized for O(1) per entry)
   */
  async getTopPlayers(db: firestore.Firestore, limitCount: number = 10) {
    const q = firestore.query(
      firestore.collection(db, "leaderboard"),
      firestore.orderBy("xp", "desc"),
      firestore.limit(limitCount)
    );
    const snap = await firestore.getDocs(q);
    return snap.docs.map(doc => doc.data());
  }
};
