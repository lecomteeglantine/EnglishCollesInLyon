#!/usr/bin/env python3
"""
build_all.py — reconstruit tous les fichiers générés du site à partir des sources.

Sources (dans le repo) :
  - civilisation-N-pays.md (8 dossiers)      -> atlas, civi-data.js, brief-data.js
  - cpge_vocab_*.html (86 chapitres)         -> vocab-data.js, wotd-data.js
  - atlas-engine.html (le moteur des atlas)
  - uk-hand.json (les 4 parcours UK rédigés main)
  - flags.json (les drapeaux SVG)

Lancé automatiquement par GitHub Actions à chaque modification des sources,
ou à la main :  python3 build_all.py
"""
import re, json, glob, os, random, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import generate_atlas as GA
import parse_chapters as PC

OK = []

def clean(s):
    s = re.sub(r'\*\*(.+?)\*\*', r'\1', s)
    s = re.sub(r'\*(.+?)\*', r'\1', s)
    s = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', s)
    return re.sub(r'\s+', ' ', s).strip()

# ------------------------------------------------------------------ vocabulaire
def build_vocab():
    files = sorted(glob.glob('cpge_vocab_*.html'))
    if not files:
        print('vocabulaire : aucun chapitre trouvé, étape sautée'); return
    chapters = [PC.parse_file(f) for f in files]
    chapters.sort(key=lambda c: (c['part'], c['chapter']))
    data = {'chapters': chapters, 'parts': {
        "1":"Politics & Government","2":"The United States","3":"The United Kingdom",
        "4":"Society","5":"Economics","6":"International Relations",
        "7":"Science & Technology","8":"Environment","9":"Media & Culture","10":"Concours Toolkit"}}
    with open('vocab-data.js','w',encoding='utf-8') as f:
        f.write("// Généré automatiquement par build_all.py — ne pas éditer à la main\n")
        f.write("window.VOCAB = "); json.dump(data, f, ensure_ascii=False); f.write(";\n")
    OK.append(f"vocab-data.js ({sum(c['count'] for c in chapters)} entrées)")

    # --- mot du jour : sélection déterministe (seed fixe -> stable d'un build à l'autre)
    random.seed(42)
    pools = []
    for c in chapters:
        entries = [dict(e, chId=c['id'], chTitle=c['title'], chFile=c['file'], chNum=c['chapter'])
                   for s in c['sections'] for e in s['entries']
                   if e['term'] and e['fr'] and e['def'] and e['ex'] and len(e['term']) <= 32]
        random.shuffle(entries)
        pools.append(entries)
    picked, seen, i = [], set(), 0
    while len(picked) < 366 and any(pools):
        pool = pools[i % len(pools)]
        while pool:
            e = pool.pop()
            if e['term'].lower() not in seen:
                seen.add(e['term'].lower()); picked.append(e); break
        i += 1
    random.shuffle(picked)
    out = [{k: e[k] for k in ('term','ipa','pron','fr','def','ex','chId','chTitle','chFile','chNum')} for e in picked]
    with open('wotd-data.js','w',encoding='utf-8') as f:
        f.write("// Mot du jour — généré automatiquement par build_all.py\n")
        f.write("window.WOTD = "); json.dump(out, f, ensure_ascii=False); f.write(";\n")
    OK.append(f"wotd-data.js ({len(out)} mots)")

# ------------------------------------------------------------------ civi + brief
CODES = {'1':'gb','2':'us','3':'ie','4':'ca','5':'au','6':'nz','7':'in','8':'za'}
CNAMES = {'1':'the United Kingdom','2':'the United States','3':'Ireland','4':'Canada',
          '5':'Australia','6':'New Zealand','7':'India','8':'South Africa'}

def build_civi_and_brief():
    mds = sorted(glob.glob('civilisation-*.md'))
    if not mds:
        print('civi : aucun dossier trouvé, étape sautée'); return
    BAD = ('colle','trap','how it comes up','hidden stakes','to be checked','see section')
    facts, brief = [], {}
    for path in mds:
        num = re.search(r'civilisation-(\d)', path).group(1)
        code, country = CODES[num], CNAMES[num]
        section = ""
        for line in open(path, encoding='utf-8'):
            m = re.match(r'##+\s*\d*\.?\s*(.+)', line)
            if m: section = clean(m.group(1)); continue
            m = re.match(r'- (.+)', line)
            if not m: continue
            sl = section.lower()
            if any(k in sl for k in ('colle','vocabulary','contents')): continue
            t = clean(m.group(1))
            if len(t) < 80 or len(t) > 300: continue
            if not t[0].isalpha() or not t[0].isupper(): continue
            if any(k in t.lower() for k in BAD): continue
            if t.count('·') > 1: continue
            sec = re.sub(r'^[^A-Za-z]+', '', section)
            if sec.isupper(): sec = sec.capitalize()
            facts.append({'fact': t, 'country': country, 'section': sec, 'code': code})
        # banque d'angles -> questions du Daily Brief
        md = open(path, encoding='utf-8').read()
        az = re.search(r'BANK OF COLLE ANGLES[^\n]*\n([\s\S]*?)\n\n', md)
        qs = []
        if az:
            for l in az.group(1).split('\n'):
                if l.startswith('- '):
                    q = clean(l[2:]); qs.append(q if q.endswith('?') else q + '?')
        brief[code] = dict(name=country, questions=qs)

    random.seed(42); random.shuffle(facts)
    flags = json.load(open('flags.json', encoding='utf-8'))
    with open('civi-data.js','w',encoding='utf-8') as f:
        f.write('// Civi fact of the day — généré automatiquement par build_all.py\n')
        f.write('window.CIVI_FLAGS = '); json.dump(flags, f, ensure_ascii=False); f.write(';\n')
        f.write('window.CIVI = '); json.dump(facts, f, ensure_ascii=False); f.write(';\n')
    OK.append(f"civi-data.js ({len(facts)} faits)")
    with open('brief-data.js','w',encoding='utf-8') as f:
        f.write('// Questions du Daily Brief par pays — généré automatiquement par build_all.py\n')
        f.write('window.BRIEF = '); json.dump(brief, f, ensure_ascii=False); f.write(';\n')
    OK.append(f"brief-data.js ({len(brief)} pays)")


# ------------------------------------------------------------------ frises chronologiques
STRAPS = {'gb':"From Magna Carta to Brexit and the return of Labour.",
          'us':"From the Declaration of Independence to today's divided democracy.",
          'ie':"From conquest and famine to independence and a social revolution.",
          'ca':"From New France to a G7 nation still negotiating its identity.",
          'au':"From the First Fleet to a Pacific nation debating its future.",
          'nz':"From the Treaty of Waitangi to a small nation with a big voice.",
          'in':"From the Raj to the world's largest democracy.",
          'za':"From colonisation and apartheid to the rainbow nation."}

def _tl_bucket(year):
    if year < 1800: return ("origins", "Origins & foundations")
    if year < 1914: return ("c19", "The long 19th century")
    if year < 1960: return ("wars", "Wars & independence")
    if year < 2000: return ("late20", "Late 20th century")
    return ("today", "Contemporary")

def build_timelines():
    mds = sorted(glob.glob('civilisation-*.md'))
    if not mds:
        print('frises : aucun dossier trouvé, étape sautée'); return
    flags = json.load(open('flags.json', encoding='utf-8'))
    TL = {}
    for path in mds:
        num = re.search(r'civilisation-(\d)', path).group(1)
        code, name = CODES[num], CNAMES[num]
        C, D = GA.parse_dossier(path)
        # mots-clés et questions disponibles pour enrichir les événements
        cards = D['cards']
        if code == 'gb' and os.path.exists('uk-timeline.json'):
            events = json.load(open('uk-timeline.json', encoding='utf-8'))
        else:
            events = []
            for d in D['dates']:
                m = re.search(r'(\d{3,4})', d['y'])
                if not m: continue
                year = int(m.group(1))
                era, tag = _tl_bucket(year)
                txt = d['why']
                parts = re.split(r';\s*', txt, maxsplit=1)
                what = parts[0].strip()
                why = parts[1].strip().capitalize() if len(parts) > 1 else "It remains a live reference in colle documents and debates today."
                if not what.endswith('.'): what += '.'
                if not why.endswith('.'): why += '.'
                # carte thématique la plus proche (mots communs dans le titre)
                twords = set(re.findall(r'[a-z]{4,}', (d['t'] + ' ' + txt).lower()))
                best, score = None, 0
                for c in cards:
                    cw = set(re.findall(r'[a-z]{4,}', (c['title'] + ' ' + ' '.join(c['tags'])).lower()))
                    s = len(twords & cw)
                    if s > score: best, score = c, s
                keywords = (best['tags'][:3] if best and best['tags'] else [t for t in list(twords)[:3]])
                colle = (best['questions'][0] if best and best['questions'] else f"Why does {d['t']} still matter today?")
                title = d['t'][0].upper() + d['t'][1:] if d['t'] else d['t']
                events.append(dict(year=year, date=d['y'], era=era, tag=tag, title=title,
                                   summary=what, what=what, why=why,
                                   keywords=keywords[:3], colle=colle))
        priority = [f"{d['y']} — {d['t']}" for d in D['dates']][:10]
        TL[code] = dict(name=name, strap=STRAPS.get(code, ''), flag=flags.get(code, ''),
                        events=events, priority=priority)
    with open('timeline-data.js', 'w', encoding='utf-8') as f:
        f.write('// Frises chronologiques par pays — généré automatiquement par build_all.py\n')
        f.write('window.TIMELINES = '); json.dump(TL, f, ensure_ascii=False); f.write(';\n')
    OK.append(f"timeline-data.js ({len(TL)} pays, {sum(len(v['events']) for v in TL.values())} événements)")

# ------------------------------------------------------------------ atlas
def build_atlases():
    if not os.path.exists('atlas-engine.html'):
        print('atlas : moteur absent, étape sautée'); return
    for path in sorted(glob.glob('civilisation-*.md')):
        num = re.search(r'civilisation-(\d)', path).group(1)
        if num == '2':
            continue  # les US SONT le moteur (rédigé main) : on le copie tel quel
        code = CODES[num]
        out = f'colle-atlas-{code}.html'
        GA.generate(path, 'atlas-engine.html', out)
        if code == 'gb' and os.path.exists('uk-hand.json'):
            merge_uk(out)
        OK.append(out)
    # US : copie du moteur
    engine = open('atlas-engine.html', encoding='utf-8').read()
    open('colle-atlas-us.html','w',encoding='utf-8').write(engine)
    OK.append('colle-atlas-us.html (moteur)')

def merge_uk(path):
    hand = json.load(open('uk-hand.json', encoding='utf-8'))
    h = open(path, encoding='utf-8').read()
    m = re.search(r'const TOPICS=(\{.*?\});\n', h, re.S)
    topics = json.loads(m.group(1))
    MATCH = {'brexit':'brexit','monarch':'monarchy','nhs':'nhs','devolution':'devolution','health':'nhs'}
    handt = dict(hand['topics'])
    for tid, t in list(topics.items()):
        low = t['name'].lower()
        for kw, hid in MATCH.items():
            if kw in low and hid in handt:
                keep = t['chapter']
                topics[tid] = handt.pop(hid)
                topics[tid]['chapter'] = keep
                break
    h = h[:m.start()] + 'const TOPICS=' + json.dumps(topics, ensure_ascii=False) + ';\n' + h[m.end():]
    m = re.search(r'const NATIONS=\[.*?\];', h, re.S)
    h = h[:m.start()] + 'const NATIONS=' + json.dumps(hand['nations'], ensure_ascii=False) + ';' + h[m.end():]
    open(path,'w',encoding='utf-8').write(h)

# ------------------------------------------------------------------ main
if __name__ == '__main__':
    build_vocab()
    build_civi_and_brief()
    build_timelines()
    build_atlases()
    print('\nReconstruit :')
    for x in OK: print(' -', x)
