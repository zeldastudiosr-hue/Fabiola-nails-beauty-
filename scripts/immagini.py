# Prepara le immagini del sito (WebP + JPEG in più larghezze) a partire dalle foto originali.
# Uso: python3 scripts/immagini.py   (serve Pillow)
# Le foto di partenza sono in media/sorgenti/ (quelle del locale già senza persone).
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parent.parent
src = root / "media" / "sorgenti"
out = root / "assets" / "img"
out.mkdir(parents=True, exist_ok=True)

def salva(im, nome, larghezze, q=80):
    im = ImageOps.exif_transpose(im).convert("RGB")
    for w in larghezze:
        r = im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(out / f"{nome}-{w}.webp", "WEBP", quality=q, method=6)
        if w == larghezze[0]:
            r.save(out / f"{nome}-{w}.jpg", "JPEG", quality=q, optimize=True, progressive=True)
        print(f"{nome}-{w}: {r.width}x{r.height}")

LAVORI = {
    "lavoro-01-rosa-glitter-strass": None,
    # via i pollici in alto (unghia rovinata) e parte del tavolo in basso
    "lavoro-02-french-farfalle-blu": (0, 470, 1175, 1560),
    "lavoro-03-bianco-latte-ballerina": None,
    "lavoro-04-tema-mare": None,
    "lavoro-05-french-leopardata": None,
    "lavoro-06-rosa-fiocchi-fiore": None,
}
for nome, box in LAVORI.items():
    im = Image.open(src / f"{nome}.jpg")
    if box: im = im.crop(box)
    salva(im, nome, [640, 1080])

salva(Image.open(src / "centro-01-ingresso.jpg"), "centro-ingresso", [800, 1280])
salva(Image.open(src / "centro-02-sala.jpg"), "centro-sala", [800, 1280])
salva(Image.open(src / "insegna-verticale.jpg"), "insegna-verticale", [720, 1080])
salva(Image.open(src / "insegna-ravvicinata.jpg"), "insegna", [1024])
# Primo e ultimo fotogramma del video d'apertura (copertina prima della riproduzione e immagine finale)
salva(Image.open(src / "ingresso-inizio.jpg"), "ingresso-inizio", [1280], q=82)
salva(Image.open(src / "ingresso-poster.jpg"), "ingresso-poster", [1280], q=82)
