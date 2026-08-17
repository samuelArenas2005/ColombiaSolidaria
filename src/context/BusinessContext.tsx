import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  serverTimestamp,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { db, auth, isFirebaseConfigured, handleFirestoreError, OperationType } from '../firebase';
import { Business, AuditLog } from '../data/businesses';
import { deleteImageFromCloudinary } from '../utils/cloudinaryUploader';

interface BusinessContextType {
  businesses: Business[];
  auditLogs: AuditLog[];
  isLoading: boolean;
  user: User | null;
  authLoading: boolean;
  isFirebaseConnected: boolean;
  login: (email: string, pass: string) => Promise<void>;
  registerAdmin: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  addBusiness: (business: Business) => Promise<string>;
  updateBusiness: (id: string, business: Partial<Business>) => Promise<void>;
  deleteBusiness: (id: string, businessName?: string) => Promise<void>;
}

const LOCAL_STORAGE_KEY = 'jamundi_solidario_businesses_v1';
const LOCAL_STORAGE_AUDIT_KEY = 'jamundi_solidario_audit_v1';

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Initialize Auth state listener
  useEffect(() => {
    if (!auth) {
      // Local fallback auth check
      const localAdmin = localStorage.getItem('jamundi_local_admin');
      if (localAdmin) {
        setUser({ email: localAdmin, uid: 'local-admin' } as any);
      }
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Initialize Real-time Firestore sync or LocalStorage sync
  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const businessesCollection = collection(db, 'businesses');
      
      const unsubscribe = onSnapshot(
        businessesCollection,
        (snapshot) => {
          const loaded: Business[] = [];
          snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            loaded.push({
              id: docSnapshot.id,
              name: data.name || '',
              category: data.category || '',
              needType: data.needType || 'donation',
              description: data.description || '',
              fullDescription: data.fullDescription || '',
              location: data.location || undefined,
              image: data.image || '',
              contact: data.contact || { phone: '' },
              socials: data.socials || {},
              products: data.products || []
            });
          });

          setBusinesses(loaded);
          setIsLoading(false);
        },
        (error) => {
          console.warn('Aviso de Firebase Firestore (permisos o colección no creada):', error?.message || error);
          setIsLoading(false);
          // Fallback to local storage on permission/network error
          try {
            const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (cached) {
              const parsed = JSON.parse(cached);
              setBusinesses(parsed);
            } else {
              setBusinesses([]);
            }
          } catch (e) {
            setBusinesses([]);
          }
        }
      );

      return () => unsubscribe();
    } else {
      // Local storage fallback mode
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setBusinesses(parsed);
        } else {
          setBusinesses([]);
        }
      } catch (err) {
        console.error('Error loading local storage businesses:', err);
        setBusinesses([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  // Load audit logs when authenticated
  useEffect(() => {
    if (!user) {
      setAuditLogs([]);
      return;
    }

    if (isFirebaseConfigured && db) {
      const auditCollection = collection(db, 'audit_logs');
      const q = query(auditCollection, orderBy('timestamp', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const logs: AuditLog[] = [];
        snapshot.forEach((docSnapshot) => {
          logs.push({ id: docSnapshot.id, ...docSnapshot.data() } as AuditLog);
        });
        setAuditLogs(logs);
      }, (error) => {
        console.warn('Aviso de Audit Logs:', error?.message);
        try {
          const cached = localStorage.getItem(LOCAL_STORAGE_AUDIT_KEY);
          if (cached) setAuditLogs(JSON.parse(cached));
        } catch (e) {}
      });
      return () => unsubscribe();
    } else {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_AUDIT_KEY);
        if (cached) setAuditLogs(JSON.parse(cached));
      } catch (e) {}
    }
  }, [user]);

  const logAuditAction = async (businessName: string, action: 'CREATE' | 'DELETE') => {
    if (!user) return;
    const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const logData: Omit<AuditLog, 'id'> = {
      businessName,
      action,
      userEmail: user.email || 'Admin',
      timestamp: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'audit_logs', logId), logData);
      } catch (e) {
        console.error('Error saving audit log', e);
      }
    } else {
      const newLog = { id: logId, ...logData };
      setAuditLogs(prev => {
        const updated = [newLog, ...prev];
        localStorage.setItem(LOCAL_STORAGE_AUDIT_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const login = async (email: string, pass: string) => {
    if (auth) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      // Local fallback simulation
      if (email && pass) {
        localStorage.setItem('jamundi_local_admin', email);
        setUser({ email, uid: 'local-admin' } as any);
      } else {
        throw new Error('Credenciales inválidas');
      }
    }
  };

  const registerAdmin = async (email: string, pass: string) => {
    if (auth) {
      await createUserWithEmailAndPassword(auth, email, pass);
    } else {
      if (email && pass) {
        localStorage.setItem('jamundi_local_admin', email);
        setUser({ email, uid: 'local-admin' } as any);
      } else {
        throw new Error('Credenciales inválidas');
      }
    }
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    localStorage.removeItem('jamundi_local_admin');
    setUser(null);
  };

  const addBusiness = async (business: Business): Promise<string> => {
    const docId = business.id && business.id !== 'new' ? business.id : `b_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Ensure products array is max 5
    const cleanProducts = (business.products || []).slice(0, 5);

    const businessPayload: any = {
      name: business.name.trim(),
      category: business.category,
      needType: business.needType,
      description: business.description.trim(),
      fullDescription: (business.fullDescription || '').trim(),
      image: business.image || cleanProducts[0]?.image || '',
      contact: business.contact || { phone: '' },
      socials: business.socials || {},
      products: cleanProducts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (business.location) {
      businessPayload.location = {
        lat: Number(business.location.lat),
        lng: Number(business.location.lng),
        placeName: business.location.placeName || '',
        address: business.location.address || '',
        googleMapsUrl: business.location.googleMapsUrl || ''
      };
    }

    if (user) {
      businessPayload.createdBy = user.uid;
    }

    if (isFirebaseConfigured && db) {
      try {
        const businessDocRef = doc(db, 'businesses', docId);
        await setDoc(businessDocRef, businessPayload);
        await logAuditAction(businessPayload.name, 'CREATE');
        return docId;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `businesses/${docId}`);
      }
    } else {
      // Local storage persistence
      const newBusiness: Business = {
        ...businessPayload,
        id: docId
      };
      const updated = [newBusiness, ...businesses.filter(b => b.id !== docId)];
      setBusinesses(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      await logAuditAction(businessPayload.name, 'CREATE');
      return docId;
    }
    return ''; // added to satisfy typescript if error thrown
  };

  const updateBusiness = async (id: string, business: Partial<Business>): Promise<void> => {
    const updatePayload: any = {
      ...business,
      updatedAt: new Date().toISOString()
    };

    if (updatePayload.products) {
      updatePayload.products = updatePayload.products.slice(0, 5);
    }

    if (isFirebaseConfigured && db) {
      try {
        const businessDocRef = doc(db, 'businesses', id);
        await updateDoc(businessDocRef, updatePayload);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `businesses/${id}`);
      }
    } else {
      const updated = businesses.map(b => b.id === id ? { ...b, ...updatePayload } : b);
      setBusinesses(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const deleteBusiness = async (id: string, businessName?: string): Promise<void> => {
    let targetName = businessName;
    let targetImageUrl = '';
    
    const found = businesses.find(b => b.id === id);
    if (found) {
      targetName = targetName || found.name;
      targetImageUrl = found.image || '';
    }

    if (isFirebaseConfigured && db) {
      try {
        const businessDocRef = doc(db, 'businesses', id);
        await deleteDoc(businessDocRef);
        if (targetName) await logAuditAction(targetName, 'DELETE');
        if (targetImageUrl) {
          await deleteImageFromCloudinary(targetImageUrl).catch(e => console.warn('No se pudo eliminar imagen en Cloudinary:', e));
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `businesses/${id}`);
      }
    } else {
      const updated = businesses.filter(b => b.id !== id);
      setBusinesses(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      if (targetName) await logAuditAction(targetName, 'DELETE');
      if (targetImageUrl) {
        await deleteImageFromCloudinary(targetImageUrl).catch(e => console.warn('No se pudo eliminar imagen en Cloudinary:', e));
      }
    }
  };

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        auditLogs,
        isLoading,
        user,
        authLoading,
        isFirebaseConnected: isFirebaseConfigured,
        login,
        registerAdmin,
        logout,
        addBusiness,
        updateBusiness,
        deleteBusiness
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusinesses() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusinesses debe usarse dentro de un BusinessProvider');
  }
  return context;
}
