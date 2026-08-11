import { MovementRecord } from '../types';

declare global {
  interface Window {
    google?: {
      script?: {
        run: {
          withSuccessHandler: (callback: (data: any[]) => void) => {
            withFailureHandler: (callback: (err: any) => void) => any;
          };
        };
      };
    };
  }
}

/**
 * Checks if running inside Google Apps Script Web App environment
 */
export const isGoogleAppsScript = (): boolean => {
  return typeof window !== 'undefined' && Boolean(window.google?.script?.run);
};

/**
 * Fetches data from Google Apps Script backend if available
 */
export const fetchGoogleAppsScriptData = (): Promise<MovementRecord[]> => {
  return new Promise((resolve, reject) => {
    if (!isGoogleAppsScript()) {
      reject(new Error('Google Apps Script environment not detected'));
      return;
    }

    try {
      window.google!.script!.run
        .withSuccessHandler((data: any[]) => {
          if (!Array.isArray(data)) {
            resolve([]);
            return;
          }

          // Parse raw rows array from Google Sheet: [plant, id, email, timeIn, lat, lon, timeOut, zone, obs]
          const records: MovementRecord[] = data.map((row, index) => {
            const [plant, id, email, timeIn, lat, lon, timeOut, zone, obs] = row;
            const isOutOfZone = String(zone || '').trim().toLowerCase() === 'out of zone';
            const hasObs = obs && String(obs).trim().toUpperCase() !== 'RAS' && String(obs).trim() !== '';
            
            let riskLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' = 'NONE';
            if (!isOutOfZone && hasObs) {
              riskLevel = 'HIGH';
            }

            return {
              id: id ? String(id) : `REC-GAS-${index + 1}`,
              plant: (plant || 'OGGAZ') as any,
              agentId: `AG-${100 + index}`,
              fullName: email ? String(email).split('@')[0].replace('.', ' ') : `Agent ${index + 1}`,
              email: email ? String(email) : `agent${index}@holcim.com`,
              role: 'Opérateur Terrain',
              timeIn: timeIn ? String(timeIn) : new Date().toISOString().replace('T', ' ').slice(0, 19),
              timeOut: timeOut ? String(timeOut) : null,
              lat: Number(lat) || 35.5861,
              lon: Number(lon) || -0.3254,
              zone: zone ? String(zone) : 'Zone Cru',
              observation: obs ? String(obs) : 'RAS',
              riskLevel,
              ppeStatus: { helmet: true, vest: true, boots: true, goggles: true },
              createdAt: new Date().toISOString()
            };
          });

          resolve(records);
        })
        .withFailureHandler((err: any) => {
          console.error('Google Apps Script fetch error:', err);
          reject(err);
        })
        .fetchCombinedData();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Save new movement record back to Google Sheets via Google Apps Script
 */
export const saveGoogleAppsScriptRecord = (record: MovementRecord): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!isGoogleAppsScript()) {
      resolve(false);
      return;
    }

    try {
      // Row structure: [plant, id, email, timeIn, lat, lon, timeOut, zone, obs]
      const rowData = [
        record.plant,
        record.id,
        record.email,
        record.timeIn,
        record.lat,
        record.lon,
        record.timeOut || '',
        record.zone,
        record.observation
      ];

      (window.google!.script!.run as any)
        .withSuccessHandler(() => resolve(true))
        .withFailureHandler(() => resolve(false))
        .saveMovementRecord(rowData);
    } catch {
      resolve(false);
    }
  });
};

/**
 * GAS Code.gs snippet for users
 */
export const GAS_CODE_SNIPPET = `// ====================================================
// CODE.GS - HSE GPS Tracker for Google Apps Script & Google Sheets
// Holcim El Djazaïr | Control Tower
// ====================================================

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('HSE GPS Tracker - Holcim')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Fetches all movement data from active Google Sheet tab 'GPS_Data'
 */
function fetchCombinedData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('GPS_Data') || ss.getSheets()[0];
  var lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return [];
  }
  
  // Reads range from row 2 (skipping headers)
  var data = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
  return data;
}

/**
 * Appends a new movement row to Google Sheet
 * Expects array: [plant, id, email, timeIn, lat, lon, timeOut, zone, obs]
 */
function saveMovementRecord(rowData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('GPS_Data') || ss.getSheets()[0];
  sheet.appendRow(rowData);
  return true;
}

/**
 * Updates an existing movement row by ID
 */
function updateMovementRecord(id, rowData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('GPS_Data') || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]) === String(id)) {
      sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
      return true;
    }
  }
  return false;
}
`;
