# Turkish Music API Guide 🎵🇹🇷

This guide explains how to get free Turkish music for your app and the available APIs.

## Current Implementation

### 1. **Jamendo API** (Primary - Already Integrated) ✅

**Status**: Already working in your app!

**How to use**:
- Select "Turkey" from the Region filter
- Or search for "turkish", "türk", "istanbul", etc.
- The app automatically searches with tags: `turkish`, `anatolian`, `oriental`, `arabesque`, etc.

**Get API Key**: https://devportal.jamendo.com/
- Free tier: 2000 requests/day
- No credit card required

**Pros**:
- ✅ Already integrated
- ✅ Free and legal
- ✅ Direct MP3 downloads
- ✅ Good metadata (artist, album, images)

**Cons**:
- ⚠️ Limited Turkish music selection (mostly independent artists)

---

## Alternative Free APIs for Turkish Music

### 2. **Internet Archive API** (Free & Legal) 📚

**What it is**: Massive archive of public domain and Creative Commons music

**Turkish Music**: Search for "turkish", "turk", "istanbul", "anatolian"

**How to use**:
```javascript
import { getInternetArchiveTurkishMusic } from './services/turkishMusicApi';

const tracks = await getInternetArchiveTurkishMusic('turkish', 20);
```

**API Endpoint**: `https://archive.org/advancedsearch.php`

**Pros**:
- ✅ Completely free
- ✅ No API key needed
- ✅ Large collection
- ✅ Legal downloads

**Cons**:
- ⚠️ May require backend for CORS
- ⚠️ Less structured metadata
- ⚠️ Mixed quality

**Example Search**:
- Collection: `opensource_audio`
- Query: `turkish OR turk OR turkey OR anatolian`

---

### 3. **Freesound API** (Creative Commons) 🎶

**What it is**: Database of Creative Commons licensed sounds and music

**Get API Key**: https://freesound.org/apiv2/apply/
- Free tier available
- Requires registration

**How to use**:
```javascript
import { getFreesoundTurkishMusic } from './services/turkishMusicApi';

const tracks = await getFreesoundTurkishMusic('YOUR_API_KEY', 'turkish', 20);
```

**Pros**:
- ✅ Free API
- ✅ Creative Commons licensed
- ✅ Good for sound effects too

**Cons**:
- ⚠️ More sound effects than full songs
- ⚠️ Requires API key
- ⚠️ Limited Turkish music

---

### 4. **Free Music Archive (FMA)** 🎼

**What it is**: Repository of royalty-free music

**Website**: https://freemusicarchive.org/

**Turkish Music**: Search manually on website

**Pros**:
- ✅ Free and legal
- ✅ Good quality

**Cons**:
- ❌ No official API (scraping required)
- ❌ Manual search only

---

### 5. **SoundCloud API** (Limited) 🎧

**What it is**: Some artists share royalty-free Turkish music

**Note**: 
- Requires OAuth authentication
- Most tracks are copyrighted
- Only tracks marked "Download" are available
- Not recommended for production

---

## Recommended Approach

### Option 1: Enhanced Jamendo (Easiest) ⭐

**Already implemented!** Just use the Region filter:
1. Select "Turkey" from sidebar
2. App automatically searches with multiple Turkish tags
3. Get results instantly

**To get more results**, the app now searches with:
- `turkish`
- `anatolian`
- `oriental`
- `turkey`
- `turk`
- `istanbul`
- `ankara`
- `turkish-folk`
- `turkish-pop`
- `arabesque`

### Option 2: Combine Multiple Sources

Use the `getAllTurkishMusic()` function to combine:
- Jamendo (primary)
- Internet Archive (backup)
- Freesound (optional, needs API key)

```javascript
import { getAllTurkishMusic } from './services/turkishMusicApi';
import musicApi from './services/musicApi';

const tracks = await getAllTurkishMusic({
  jamendoApi: musicApi,
  freesoundApiKey: 'YOUR_KEY', // optional
  includeInternetArchive: true,
  limit: 50,
});
```

---

## Quick Setup for More Turkish Music

### Step 1: Get Jamendo API Key (Required)
1. Go to https://devportal.jamendo.com/
2. Sign up (free)
3. Get your Client ID
4. Add to `.env`: `VITE_JAMENDO_CLIENT_ID=your_key`

### Step 2: Test Turkish Music Search
1. Run the app: `npm run dev`
2. Select "Turkey" from Region filter
3. Browse Turkish music!

### Step 3: (Optional) Add Internet Archive
The `turkishMusicApi.js` file is already created. To use it:

```javascript
// In your component
import { getInternetArchiveTurkishMusic } from '../services/turkishMusicApi';

// Fetch Turkish music from Internet Archive
const archiveTracks = await getInternetArchiveTurkishMusic('turkish', 20);
```

---

## Tips for Finding More Turkish Music

1. **Use Turkish search terms**:
   - `türk` (Turkish in Turkish)
   - `türkçe` (Turkish language)
   - `istanbul`
   - `ankara`
   - `arabesque` (Turkish music genre)

2. **Combine with genres**:
   - Turkish Pop
   - Turkish Folk
   - Turkish Rock
   - Anatolian Rock

3. **Search by popular Turkish artists** (if available):
   - Search for artist names in the search bar

---

## Legal Notes ⚖️

✅ **Safe to use**:
- Jamendo tracks (Creative Commons)
- Internet Archive (Public Domain/CC)
- Freesound (Creative Commons)

❌ **Avoid**:
- YouTube downloads (copyright issues)
- Spotify/Deezer (requires subscription, not free)
- Commercial music APIs (costs money)

---

## Summary

**Best option for your app**: **Jamendo API** (already integrated!)
- Free
- Legal
- Easy to use
- Good quality

**To get started**: Just select "Turkey" from the Region filter! 🎵

The app is already optimized to find Turkish music with multiple search strategies.
