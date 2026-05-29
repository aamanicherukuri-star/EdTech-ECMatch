import gspread
from oauth2client.service_account import ServiceAccountCredentials 
import firebase_admin
from firebase_admin import credentials, firestore 

# 1. Connect to Google Sheets
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
google_creds = ServiceAccountCredentials.from_json_keyfile_name("google_creds.json", scope)
client = gspread.authorize(google_creds) 

sheet = client.open("EC_match_database").sheet1

# 2. Connect to the SPECIFIC Firebase Firestore Database Room
firebase_creds = credentials.Certificate("serviceAccountKey.json") 
firebase_admin.initialize_app(firebase_creds)

# We pass your ai-studio instance ID here so it updates the database your website is watching
db = firestore.client()

def sync_spreadsheet_to_firebase():
    all_rows = sheet.get_all_records()

    print(f"Found {len(all_rows)} opportunities in the spreadsheet. Syncing to Firebase...")

    for row in all_rows:
        if not row.get('title'):
            continue 

        opportunity_data = {
            "title": str(row['title']),
            "subject": str(row['subject']),
            "topic": str(row['topic']),
            "cost": str(row['cost']),
            "format": str(row['format']),
            "type": str(row['type']),
            "ageGroup": str(row['ageGroup']),
            "prestigeRating": int(row['prestigeRating']) if row['prestigeRating'] else 3,
            "deadline": str(row['deadline']),
            "description": str(row['description']),
            "url": str(row['url']),
            "isVerified": True
        }

        # Upload to firestore under 'opportunities' using the title as the custom document ID
        doc_id = str(row['title']).lower().replace(" ", "-")[:50]
        db.collection("opportunities").document(doc_id).set(opportunity_data)
        print(f"Synced: {row['title']}")

if __name__ == "__main__":
    sync_spreadsheet_to_firebase()