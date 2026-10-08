# Gemini TTS (free tier) with the structured prompt that stops directions being read aloud.
# usage: python gemini_tts.py <api_key> <transcript.txt> <out.wav> [voice=Kore] [profile.txt]
#  - transcript.txt: ONLY the words to speak (strip [cues] first)
#  - profile.txt (optional): AUDIO PROFILE / SCENE / DIRECTOR'S NOTES text. Never quote transcript lines in it.
# Always re-check the take with transcribe.py: extra lines = regenerate.
import json, sys, base64, urllib.request, urllib.error, subprocess, re
key, src, out = sys.argv[1:4]; voice = sys.argv[4] if len(sys.argv) > 4 else "Kore"
text = re.sub(r"\[[^\]]*\]", "", open(src, encoding="utf-8").read())
profile = open(sys.argv[5], encoding="utf-8").read() if len(sys.argv) > 5 else """# AUDIO PROFILE: a warm, confident brand narrator
A real person, never an announcer. Close to the microphone, sincere and expressive.
### DIRECTOR'S NOTES
Style: warm storytelling, proud when naming the company, energy rising through lists, inviting at the end.
Pacing: natural breaths, short pauses between sentences; unhurried but never slow.
Read the transcript exactly once, word for word, and nothing else."""
prompt = f"{profile}\n\n#### TRANSCRIPT\n{text}"
body = json.dumps({"contents": [{"role": "user", "parts": [{"text": prompt}]}], "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}).encode()
r = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent?key={key}", data=body, headers={"Content-Type": "application/json"})
try:
    d = json.load(urllib.request.urlopen(r, timeout=600))
except urllib.error.HTTPError as e:
    sys.exit(f"{e.code} {e.read()[:300]}")
pcm = out + ".pcm"
open(pcm, "wb").write(base64.b64decode(d["candidates"][0]["content"]["parts"][0]["inlineData"]["data"]))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", pcm, out], check=True)
print("ok", out)
