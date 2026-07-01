import os
import glob
import datetime

paths = [
    r"C:\Users\CANDLEMASTER\Downloads",
    r"C:\Users\CANDLEMASTER\Desktop",
    r"C:\Users\CANDLEMASTER\Desktop\Kalaphol Pixel",
    r"C:\Users\CANDLEMASTER\Desktop\Kalaphol Pixel\Graphic Design"
]

all_files = []
for p in paths:
    if os.path.exists(p):
        for entry in os.scandir(p):
            if entry.is_file() and entry.name.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                try:
                    stat = entry.stat()
                    mtime = datetime.datetime.fromtimestamp(stat.st_mtime)
                    all_files.append((entry.path, stat.st_size, mtime))
                except Exception as e:
                    pass

# Sort by mtime descending
all_files.sort(key=lambda x: x[2], reverse=True)

print("Top 20 most recent image files:")
for path, size, mtime in all_files[:20]:
    print(f"{mtime} | {size} bytes | {path}")
