/**
 * MediKiosk Offline Resilient Synchronization Engine
 * Spec-compliant for rural PHCs, CHCs, and Ayush dispensaries with intermittent connectivity.
 */

import { supabase } from '../lib/supabase';

export interface OfflineQueueItem {
  id: string;
  type: 'patient_sync' | 'doctor_consultation' | 'prescription_update' | 'document_upload';
  patientToken: string;
  payload: any;
  timestamp: number;
  retryCount: number;
}

const OFFLINE_QUEUE_KEY = 'medikiosk_offline_queue';
const OFFLINE_PATIENTS_KEY = 'medikiosk_offline_patients';

type NetworkListener = (isOnline: boolean, pendingCount: number) => void;
const listeners: Set<NetworkListener> = new Set();

class OfflineSyncService {
  private isOnlineState: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));
    }
  }

  private handleNetworkChange(isOnline: boolean) {
    this.isOnlineState = isOnline;
    const count = this.getPendingCount();
    listeners.forEach((fn) => fn(isOnline, count));

    if (isOnline && count > 0) {
      console.log('[OfflineSync] Network restored. Auto-syncing ' + count + ' pending records...');
      this.syncPendingQueue().catch((err) =>
        console.warn('[OfflineSync] Auto-sync encountered an error:', err)
      );
    }
  }

  isOnline(): boolean {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return this.isOnlineState;
  }

  subscribe(listener: NetworkListener): () => void {
    listeners.add(listener);
    listener(this.isOnline(), this.getPendingCount());
    return () => listeners.delete(listener);
  }

  getQueue(): OfflineQueueItem[] {
    try {
      const data = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getPendingCount(): number {
    return this.getQueue().length;
  }

  saveQueue(queue: OfflineQueueItem[]): void {
    try {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
      listeners.forEach((fn) => fn(this.isOnline(), queue.length));
    } catch (e) {
      console.error('[OfflineSync] Failed to persist offline queue:', e);
    }
  }

  enqueue(type: OfflineQueueItem['type'], patientToken: string, payload: any): void {
    const queue = this.getQueue();
    // Dedup or replace existing pending sync for the same patient
    const filtered = queue.filter((item) => !(item.patientToken === patientToken && item.type === type));
    const newItem: OfflineQueueItem = {
      id: type + '_' + patientToken + '_' + Date.now(),
      type,
      patientToken,
      payload,
      timestamp: Date.now(),
      retryCount: 0
    };
    filtered.push(newItem);
    this.saveQueue(filtered);
    this.cacheOfflinePatient(patientToken, payload);
    console.log('[OfflineSync] Enqueued offline record for patient ' + patientToken + '. Total in queue: ' + filtered.length);
  }

  cacheOfflinePatient(patientToken: string, patientData: any): void {
    try {
      const raw = localStorage.getItem(OFFLINE_PATIENTS_KEY);
      const map: Record<string, any> = raw ? JSON.parse(raw) : {};
      map[patientToken] = { ...patientData, cachedAt: Date.now() };
      localStorage.setItem(OFFLINE_PATIENTS_KEY, JSON.stringify(map));
    } catch (e) {
      console.error('[OfflineSync] Failed to cache patient locally:', e);
    }
  }

  getCachedOfflinePatients(): Record<string, any> {
    try {
      const raw = localStorage.getItem(OFFLINE_PATIENTS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  async syncPendingQueue(): Promise<{ synced: number; failed: number }> {
    if (!this.isOnline()) {
      return { synced: 0, failed: this.getPendingCount() };
    }

    const queue = this.getQueue();
    if (queue.length === 0) return { synced: 0, failed: 0 };

    let synced = 0;
    const remaining: OfflineQueueItem[] = [];

    for (const item of queue) {
      try {
        if (item.type === 'patient_sync' || item.type === 'doctor_consultation') {
          const patient = item.payload;
          const { error } = await supabase.from('patients').upsert(
            {
              id: patient.token,
              token: patient.token,
              name: patient.name,
              age: patient.age,
              gender: patient.gender,
              phone: patient.phone,
              chief_complaint: patient.chiefComplaint,
              symptom_duration: patient.symptomDuration,
              symptom_severity: patient.symptomSeverity,
              triage_level: patient.triageLevel,
              red_flags: patient.redFlags || [],
              prakriti: patient.prakriti || '',
              status: patient.status || 'waiting',
              history: {
                site: patient.symptomSite,
                character: patient.symptomCharacter,
                radiation: patient.symptomRadiation,
                timing: patient.symptomTiming,
                aggravating: patient.aggravatingFactors,
                relieving: patient.relievingFactors,
                associated: patient.associatedSymptoms,
                chronic: patient.chronicConditions,
                allergies: patient.allergies,
                ayush: patient.ayushResponses,
                dashavidha: patient.dashavidha,
                ashtaSthana: patient.ashtaSthana,
                doctorNotes: patient.doctorNotes,
                primaryDiagnosis: patient.primaryDiagnosis,
                namasteCode: patient.namasteCode,
                prescribedMeds: patient.prescribedMeds,
                uploadedDocuments: patient.uploadedDocuments
              },
              updated_at: new Date().toISOString()
            },
            { onConflict: 'token' }
          );

          if (error) throw error;
          synced++;
        } else {
          synced++;
        }
      } catch (err) {
        console.warn('[OfflineSync] Sync failed for item ' + item.id + ':', err);
        item.retryCount = (item.retryCount || 0) + 1;
        remaining.push(item);
      }
    }

    this.saveQueue(remaining);
    return { synced, failed: remaining.length };
  }
}

export const offlineSyncService = new OfflineSyncService();
